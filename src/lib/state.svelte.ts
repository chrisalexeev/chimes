import { Synth } from "./synth";

export interface Velocity {
  dX: number;
  dY: number;
}

export class VisState {
  radius = $state(10);
  private interval = 10;
  private lastUpdateTime = 0;
  noteNodes: {
    noteNumber: number;
    color?: string;
    velocity: Velocity;
    position: { x: number; y: number };
  }[] = $state([]);
  height: number = $state(0);
  width: number = $state(0);
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  canvasColor: string = $state("white");
  synth: Synth;
  frictionCoefficient: number | undefined = $state(1.0);
  wallRestitution: number | undefined = $state(1.0);
  nodeRestitution: number | undefined = $state(1.0);
  isPaused: boolean = $state(true);

  constructor(canvas: HTMLCanvasElement, synth: Synth) {
    this.noteNodes = [];
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.height = canvas.height;
    this.width = canvas.width;
    this.synth = synth;
  }

  addNode(noteNumber: number, startingVelocity: Velocity, color = "black") {
    this.noteNodes.push({
      noteNumber,
      velocity: startingVelocity,
      position: {
        x: Math.random() * (this.width - 2 * this.radius) + this.radius,
        y: Math.random() * (this.height - 2 * this.radius) + this.radius,
      },
      color,
    });
  }

  clearNodes() {
    this.noteNodes = [];
  }

  updateState() {
    // Add time-based movement with delta time
    const deltaTime = 1; // / 60; // Assuming 60fps, better to use actual time between frames

    // Configurable physics parameters
    const frictionCoefficient = this.frictionCoefficient || 1.0; // 1.0 = no friction, 0.9 = some friction
    const wallRestitution = this.wallRestitution || 1.0; // 1.0 = no energy loss, 0.8 = some energy loss
    const nodeRestitution = this.nodeRestitution || 1.0; // 1.0 = elastic collisions, 0.9 = some energy loss

    // First update all positions based on current velocities
    this.noteNodes.forEach((data) => {
      const { velocity, position } = data;

      // Apply velocity with deltaTime for frame-rate independence
      position.x += velocity.dX * deltaTime;
      position.y += velocity.dY * deltaTime;

      // Apply friction if coefficient is less than 1
      if (frictionCoefficient < 1.0) {
        velocity.dX *= frictionCoefficient;
        velocity.dY *= frictionCoefficient;
      }
    });

    // Handle wall collisions
    this.noteNodes.forEach((data) => {
      const { velocity, position, noteNumber } = data;

      let wallCollision = false;

      if (position.x - this.radius < 0) {
        position.x = this.radius; // Prevent sticking in the wall
        velocity.dX = Math.abs(velocity.dX) * wallRestitution; // Configurable energy loss
        wallCollision = true;
      } else if (position.x + this.radius > this.width) {
        position.x = this.width - this.radius; // Prevent sticking in the wall
        velocity.dX = -Math.abs(velocity.dX) * wallRestitution; // Configurable energy loss
        wallCollision = true;
      }

      if (position.y - this.radius < 0) {
        position.y = this.radius; // Prevent sticking in the wall
        velocity.dY = Math.abs(velocity.dY) * wallRestitution; // Configurable energy loss
        wallCollision = true;
      } else if (position.y + this.radius > this.height) {
        position.y = this.height - this.radius; // Prevent sticking in the wall
        velocity.dY = -Math.abs(velocity.dY) * wallRestitution; // Configurable energy loss
        wallCollision = true;
      }

      if (wallCollision) {
        this.synth.play(noteNumber);
      }
    });

    // Collect all node-node collision pairs before resolving any
    const collisions: any[] = [];

    // Detect collisions

    this.noteNodes.forEach((data1, i) => {
      this.noteNodes.forEach((data2, j) => {
        // Skip self-collisions and duplicates (only process each pair once)
        if (i >= j) return;

        const dx = data1.position.x - data2.position.x;
        const dy = data1.position.y - data2.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = this.radius * 2;

        if (distance < minDistance) {
          // This is a valid collision
          collisions.push({
            noteNumber1: data1.noteNumber,
            noteNumber2: data2.noteNumber,
            data1,
            data2,
            distance,
            dx,
            dy,
          });
        }
      });
    });

    // Resolve all collisions
    for (const collision of collisions) {
      const { noteNumber1, noteNumber2, data1, data2, distance, dx, dy } =
        collision;
      const minDistance = this.radius * 2;

      // Calculate collision response
      const angle = Math.atan2(dy, dx);

      // Calculate normal vector of collision
      const nx = Math.cos(angle);
      const ny = Math.sin(angle);

      // Correct overlapping positions symmetrically
      const overlap = minDistance - distance;
      data1.position.x += (nx * overlap) / 2;
      data1.position.y += (ny * overlap) / 2;
      data2.position.x -= (nx * overlap) / 2;
      data2.position.y -= (ny * overlap) / 2;

      // Calculate relative velocity
      const dvx = data1.velocity.dX - data2.velocity.dX;
      const dvy = data1.velocity.dY - data2.velocity.dY;

      // Calculate impact velocity along the normal
      const velocityAlongNormal = dvx * nx + dvy * ny;

      // Don't resolve if objects are separating
      if (velocityAlongNormal > 0) continue;

      // Calculate impulse scalar (assuming equal mass)
      const impulse = -(1 + nodeRestitution) * velocityAlongNormal;

      // Apply impulse to both objects equally (in opposite directions)
      data1.velocity.dX += (impulse * nx) / 2;
      data1.velocity.dY += (impulse * ny) / 2;
      data2.velocity.dX -= (impulse * nx) / 2;
      data2.velocity.dY -= (impulse * ny) / 2;

      // Play sound for both colliding nodes
      this.synth.play(noteNumber1);
      this.synth.play(noteNumber2);
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = this.canvasColor;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.noteNodes.forEach((data) => {
      const { position, color } = data;
      this.ctx.fillStyle = color ?? "black";
      this.ctx.beginPath();
      this.ctx.arc(position.x, position.y, this.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  animate() {
    const dt = performance.now() - this.lastUpdateTime;
    if (!this.isPaused && dt > this.interval) {
      this.lastUpdateTime = performance.now();
      this.updateState();
      this.draw();
    }

    requestAnimationFrame(this.animate.bind(this));
  }

  togglePause() {
    this.isPaused = !this.isPaused;
  }

  resizeCanvas({ width, height }: { width: number; height: number }) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.draw();
  }

  reset() {
    this.clearNodes();
    this.frictionCoefficient = 1.0;
    this.wallRestitution = 1.0;
    this.nodeRestitution = 1.0;
    this.isPaused = true;
    this.lastUpdateTime = performance.now();
  }

  shiftNotes(steps: number) {
    this.noteNodes.forEach((data) => {
      data.noteNumber += steps;
    });
  }
}
