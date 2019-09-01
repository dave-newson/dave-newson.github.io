# Inverse Reaction-Control-Systems (RCS)

## Reality

In the real-world, the Reaction Control System (RCS) is used to control the rotation of the ship, and
provide limited directional thrust.  The RCS thrusters are usually dotted around the extremities of the ship
as lots of little nozzles.

RCS thrusters have to be carefully placed and balanced with a ships weight, centre of gravity, among other concerns.
They're basically really difficult to implement.

## Inverse RCS

Rather than having to implement a real simulation of RCS and ensure (or calculate) how to balance the thrusters,
we can instead make the RCS purely decorate, "firing" the thrusters in response to thrust inputs from the pilot.

> [!] Implementation detail
> It's important only to fire the RCS when a pilot input is given, rather than ride the physics properties of the ship,
> as there's lots of reasons why you might want to change the physical properties of the ship outside of the
> pilot's control.

## Nullifying main engine thrust vectors

Most ships have more than one thrust system - usually there's the main engine for forward thrust, and the RCS for
rotational thrust.

The engines providing forward thrust are usually several magnitudes more powerful than the RCS thrusters,
so it makes little sense to waste RCS fuel on forward thrust.

For this reason, the inverse RCS should disregard forward thrust allowing the main engines to take that burden.

