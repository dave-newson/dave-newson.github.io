# Sub-systems

Sub-systems are individual ship components, such as the engines, a weapon or sensor component.
Disabling one of these systems can render a powerful capital ship dead in the water, so their
incorporation into games if a favourite amongst space-dwellers.

Sub-systems can be targeted individually, and when they sustain sufficient damage it will completely disable
that sub-system until it can be repaired.

## Damage Model: Basic

The basic sub-system damage model will have a sub-system 100% functional until fully disabled by 
reaching a damage threshold. To avoid oscillation of the active state, the sub-system may remain disabled
until fully repaired.

### Example

In practice this means sub-system will self-heal over a set duration (eg. 60 seconds) back to 0% damage,
at which point the system will come back online.

| Damage | Engine thrust | State      | 
|--------|---------------|------------|
| 0%     | 100%          | Healthy    |
| 25%    | 100%          | Under fire |
| 50%    | 100%          | Under fire |
| 75%    | 100%          | Under fire |
| 99%    | 100%          | Under fire |
| 100%   | 0%            | Disabled   |
| 99%    | 0%            | Repairing  |
| 50%    | 0%            | Repairing  |
| 25%    | 0%            | Repairing  |
| 1%     | 0%            | Repairing  |
| 0%     | 100%          | Healthy    |

### Implementation

In effect this model can be quite unbalanced - the sub-system remains effective until 100% damage is inflicted,
and the system remains offline until 100% repaired.

A specific implementation may have the "repair phase" ignore further attacks, so the system is only offline
for a specific period of time (eg. 60 seconds) and then returned to full health, despite other attacks.

## Damage Model: Effectiveness

The "Effectiveness" model makes each sub-system less-effective based on the amount of damage it has received, until
a threshold is met which completely disabled the sub-system.

### Example

For example, damaging an Engine sub-system may cause the engines to provide reduced thrust.
Thrust is reduced as a direct coefficient of the damage inflicted.
When the damage is above a certain threshold - such as 75% - the engine is completely disabled and the
ship becomes dead in the water.

| Damage | Engine thrust | State      |
|--------|---------------|------------|
| 0%     | 100%          | Healthy    |
| 25%    | 75%           | Under fire |
| 50%    | 50%           | Under fire |
| 75%    | 25%           | Under fire |
| 76%    | 0%            | Disabled   |
| 100%   | 0%            | Disabled   |
| 76%    | 0%            | Repairing  |
| 75%    | 25%           | Repairing  |
| 50%    | 50%           | Repairing  |
| 25%    | 75%           | Repairing  |
| 0%     | 100%          | Healthy    |

### Implementation

Implementing this system is vastly simpler as the sub-system "effectiveness" value can be derived
from the systems health value. Functionality thresholds can be easily customised

## Damage Repair

Sub-systems are generally self-healing systems.
Each sub-system has a lower damage threshold than the armor around them.


# Types of Systems

 - Engines
 - Weapons
 - Factories (eg. hangar bay)
 - Sensors
 - Bridge

