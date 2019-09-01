# Metaball Damage System

The Metaball Damage System uses a simple array of metaballs (spheres) to track localised cumulative damage
against a unit, providing a more realistic damage model for large ships.

## Basic Damage vs Localised Damage

Say we have a ship with plate armour rated to 20,000 kilojoules. Let's call this ship Amos.

Amos is under constant attack from raiders using cannon weapons on the port side, to the equivalent
value of 15,000 kilojoules.
Amos then comes under fire, on the un-damaged starboard side, from a single pulse-laser weapon,
to the tune of 10,000 kilojoules.

The [basic damage system](basic.md) says that Amos has now received a cumulative 25,000 kilojoules of damage,
and Amos should now be dead.  This is a very simple system and easy to consume, represent and apply, but
it's also the most unrealistic.

In the above attack, the port and starboard sides should be considered independent; if the armour
is rated to 20,000 kilojoules then it should take that amount of damage - on either side - to destroy the ship.

Using this metric, Amos would still be alive, with 5,000 kilojoules of "health" on the port side,
and 10,000 on the starboard site - far from dead.

This is a much more realistic damage system, and affords Amos some tactical options, such as 
being able to steer an undamaged side of the ship into the line of fire, and potentially absorbing well over 
20,000 kilojoules of damage so long as it's distributed across the ship's hull.

## Localised Damage Sectors

A manual way to implement this system would be to separate the hull into lots of different sectors - possibly using
their own collision boxes - and each side has its own health.

But this method has a few drawbacks:
 - You have to manually create each damage sector
 - Each damage sector has to be a "reasonable" size, and we don't know what that means.
 - Attacking a "seam" between two sectors with a scatter weapon means the damage would be spread across
   two sectors. This would cause the ship to look like it has twice the expected amount of health, even
   though you consistently hit it in the same spot.

The real killer here is manual labor; nobody wants the job of carving up a ship model into various damage sectors.

## Realistic Damage

In reality, damage to a ship would be in a specific location on the ship's hull. As more damage is taken in the same
area, the armour fails and the effects of the damage are more pronounced - there's smoke, there's fire, things stop
working properly, and crews scrabble to contain or repair the damage inside the ship.

We can represent this kind of damage using metaballs - simple data representations of spheres, which can merge
and grow as further damage is inflicted.

## Creating Metaballs from damage

Each time the ship takes damage we'll record the impact location, the amount of damage, and the attack vector, 
into a table of metaballs.

We can visualise this table by placing a sphere at each location, with the radius of the sphere relative to the amount
of damage at that point. The attack vector can be represented by a simple debug vector line from the origin of the
sphere.

> TODO: Image show a ship with metaballs

Each impact should spawn a new metaball, but where metaballs overlap they should merge into a single, larger ball.

When a single metaball's damage value exceeds the rating of the ships armour, the ship is destroyed.

## Merging Metaballs

Generally speaking, any two metaballs that overlap should be merged into one consolidated ball. 
There may however be situations (see "defragging metaballs") where you need to merge two or more balls.

When merging metaballs, the location, and attack vector should be interpolated based on the damage value of
both balls.  The damage value should simply be added together.

> TODO: Image showing merging of balls

For example, we have balls A and B, which merge to ball C:

| Ball | Location | Attack Vector | Damage |
|-|-|-|-|
| A    | 0,0      | 2,4           | 1      |
| B    | 10,10    | 4,8           | 10     |
| C    | 9,9      | 4,7           | 11     |

> TODO: The above example needs some actual maths

## Defragging Metaballs

When your damage table becomes full (assuming memory isn't infinite) you'll want to "defragment"
the metaballs to free up some space. This involves merging several metaballs.

It's recommended to free up a percentage of the damage table (eg. 25%) rather than a single slot,
as only having one slot available will cause subsequent defrags every time the ship receives damage,
preventing new attack locations from "getting a foothold" on the hull, as they're always absorbed into existing
larger metaballs.

There are a few strategies you could use for defragging:

### Strategy: Smallest first, nearest neighbor

This strategy simply finds the smallest metaball, and merges it with it's nearest neighbour.

This is a very easy to implement and cheap to execute, but attacks which only inflict light damage
may never gain a "foothold" at the attack location, always being absorbed into larger areas of neighboring damage.

### Strategy: Nearest Neighbours

Inverting the previous strategy, we search for metaballs which are nearest eachother and merge them together.

This can result in a more consistent placement of metaballs, and prevents smaller balls being merged into larger
balls long distances away.

## Metaball Sizes

While the size of a metaball represents damage, it's also proportional to the size of the ship.

A metaball should be no smaller than 10% of the ships bounding box smallest dimension.

A metaball should be no larger than 25% of the ships bounding box largest dimension.

The metaball size should be interpolated between these two sizes, based on the Damage value of the metaball
and the armour rating of the ship.

> TODO: Provide the equation for this ey

## Metaball Damage Healthbar

This is the representation of health shown to the player.

### Strategy: Most Damage Overview

Take the metaball with the highest damage value, compare this with the armour rating of the ship,
and this can be used to provide a simple healthbar.

This is good for a low-level overview of the ship, but does not help make tactical decisions, or
show you a specific damage report.

### Strategy: Vertex painting

Using the metaballs damage and radius, we can paint overlapping vertices to represent the ships damage.

This provides a very specific visualisation of the damage on the ship, and allows you to see which
areas are most affected by damage.

## Healing Metaball Damage

Healing metaball damage can be done in a number of ways.

### Strategy: Heal everything

Healing points are evenly distributed across all metaballs.

This is by far the simplest system, however it is also the most unrealistic.

### Strategy: Damage repair teams

Healing points are split into groups of "damage repair teams", and each team is sent to the largest
metaballs on the ship.

A team is not re-distributed until the damage is repaired by at least 20% from when they started.

This provides a realistic damage repair model, having finite teams working on specific damage areas,
with reassignment of those teams only at meaningful intervals.

## Sub-systems

Sub-systems should not absorb damage themselves, but instead report impacts back into the Metaball damage system.

Sub-systems should derive their specific health from the Armour rating of the sub-system, and any overlapping metaballs.

Sub-systems should generally have significantly lower armour than the rest of the ship, so they can be disabled
more easily without also destroying the ship.  Any damage inflicted to a sub-system is also inflicted to ship.

Deriving health for sub-systems is a little more expensive, as metaballs and sub-system collision overlap must
be calculated.

## Weak Points

Similar to sub-systems, weak points perform collision tests against the metaballs system.

However, weak points have less Armour than the rest of the ship, and when the armour rating of a weakpoint
is exceeded, the ship is destroyed.

A critical weakness on a ship can thus be exploited, if it's location is known.

## Enhanced Armour

Opposite to weak points - a specific region of a ship (eg. the bow) may have enhanced armour above the
rest of the ship.  This enables a specific section of the ship to take more damage.

This can be solved by emitting an event on receipt of damage, and the "enhanced armour" section performing
a test to see if the impact point is within the enhanced region of the ship.

Where the armour is enhanced, the impact damage value is reduced.  This allows the same basic calculations across
the ship, but makes damage to a particular region less meaningful.