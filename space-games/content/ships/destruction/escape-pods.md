# Escape Pods

Escape pods should be launched for all large ships upon their destruction.

## Escape pod locations

Ideally the ship can be set up with a series of markers to indicate the location of escape pods
on the ship, and the escape vector. 

## Escape pod destinations

Where possible, pods should act like missiles and head for the nearest capital ship.

When the pods collide with a friendly capital ship, they simply disappear.

Where a capital ship is not in range, the pods should pick a vector away from the enemy,
and slowly come to a halt.

## Number of pods

The number of pods should always be the same for a particular ship, however the rate at which pods
are jettisoned depends on how long the ship has known it's going to explode.

| Time below 10% health | Jettison frequency |
|-|-|
| < 10 seconds | 1 pod/sec |
| < 30 seconds | 5 pods/sec |
| < 60 seconds | 10 pods/sec |

# Jettison Sequence

Pods should begin jettison at the start of the destruction sequence, and end jettison when the
ship "explodes", or when the number of jettison pods is met.

> [!] Implementation Detail
> The start and end of the jettison sequence should be determined by a pair of events, sent by the
> destruction strategy.

A ship may explode before all pods are jettisoned, as the rate of escape requires more time than the ship's destruction
sequence will last for.

