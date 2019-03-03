// class Boid {
// 	constructor(game) {
// 		this.position = createVector(random(width), random(height));
// 		this.velocity = p5.Vector.random2D();
// 		this.velocity.setMag(random(2, 4));
// 		this.acceleration = createVector();
// 		this.maxForce = 1;
// 		this.maxSpeed = 4;
// 	}

// 	edges() {
// 		if (this.position.x > width) {
// 			this.position.x = 0;
// 		} else if (this.position.x < 0) {
// 			this.position.x = width;
// 		}
// 		if (this.position.y > height) {
// 			this.position.y = 0;
// 		} else if (this.position.y < 0) {
// 			this.position.y = height;
// 		}
// 	}

// 	align(boids) {
// 		let perceptionRadius = 50;
// 		let steering = createVector();
// 		let total = 0;
// 		for (let other of boids) {
// 			let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
// 			if (other != this && d < perceptionRadius) {
// 				steering.add(other.velocity);
// 				total++;
// 			}
// 		}
// 		if (total > 0) {
// 			steering.div(total);
// 			steering.setMag(this.maxSpeed);
// 			steering.sub(this.velocity);
// 			steering.limit(this.maxForce);
// 		}
// 		return steering;
// 	}

// 	separation(boids) {
// 		let perceptionRadius = 50;
// 		let steering = createVector();
// 		let total = 0;
// 		for (let other of boids) {
// 			let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
// 			if (other != this && d < perceptionRadius) {
// 				let diff = p5.Vector.sub(this.position, other.position);
// 				diff.div(d * d);
// 				steering.add(diff);
// 				total++;
// 			}
// 		}
// 		if (total > 0) {
// 			steering.div(total);
// 			steering.setMag(this.maxSpeed);
// 			steering.sub(this.velocity);
// 			steering.limit(this.maxForce);
// 		}
// 		return steering;
// 	}

// 	cohesion(boids) {
// 		let perceptionRadius = 100;
// 		let steering = createVector();
// 		let total = 0;
// 		for (let other of boids) {
// 			let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
// 			if (other != this && d < perceptionRadius) {
// 				steering.add(other.position);
// 				total++;
// 			}
// 		}
// 		if (total > 0) {
// 			steering.div(total);
// 			steering.sub(this.position);
// 			steering.setMag(this.maxSpeed);
// 			steering.sub(this.velocity);
// 			steering.limit(this.maxForce);
// 		}
// 		return steering;
// 	}

// 	flock(boids) {
// 		let alignment = this.align(boids);
// 		let cohesion = this.cohesion(boids);
// 		let separation = this.separation(boids);

// 		alignment.mult(.5);
// 		cohesion.mult(.5);
// 		separation.mult(.5);

// 		this.acceleration.add(alignment);
// 		this.acceleration.add(cohesion);
// 		this.acceleration.add(separation);
// 	}

// 	update() {
// 		this.position.add(this.velocity);
// 		this.velocity.add(this.acceleration);
// 		this.velocity.limit(this.maxSpeed);
// 		this.acceleration.mult(0);
// 	}

// 	show() {
// 		strokeWeight(8);
// 		stroke(199);
// 		point(this.position.x, this.position.y);
// 	}
// 	draw() {
// 		background(20);
// 		for (let boid of flock) {
// 			boid.edges();
// 			boid.flock(flock);
// 			boid.update();
// 			boid.show();
// 		}
// 	}

// }
