# Mission Forge 2026 — Implementation Details & Flight Physics Engine

## 1. Mathematical Implementation of Aerospace Mechanics

### 1.1. The Tsiolkovsky Rocket Equation & Propellant Fraction
The core propulsion model in `src/lib/mission-sim.ts` calculates mission Delta-V using the classic Tsiolkovsky formulation:

$$\Delta v = I_{sp} \cdot g_0 \cdot \ln\left(\frac{m_{wet}}{m_{dry}}\right)$$

Where:
- $g_0 = 9.80665\text{ m/s}^2$ (standard gravitational acceleration at sea level).
- $I_{sp}$ is the specific impulse in seconds:
  - Cryogenic Hydrolox (RL10): $462\text{ s}$
  - Electrostatic Ion (NSTAR): $3100\text{ s}$
  - Nuclear Thermal (NERVA): $841\text{ s}$
- $m_{dry}$ is the vehicle empty mass including avionics ($6000\text{ kg}$), empty tank shells ($900\text{ kg/tank}$), solar wings ($190\text{ kg/wing}$), radioisotope generators ($45\text{ kg/RTG}$), Whipple shield ($1300\text{ kg}$), and scientific sensors.
- $m_{wet} = m_{dry} + m_{propellant}$, where each tank holds up to $9000\text{ kg}$ of fuel.

### 1.2. Anti-Gravity Field Integration
Speculative anti-gravity technology is grounded mathematically as an active counter-acceleration that reduces gravity losses during orbital insertion:

$$g_{loss} = \int_{0}^{t_{burn}} g(r) \cdot \sin(\gamma) \, dt$$

Under an active Anti-Gravity field with scalar $\lambda_{ag} \in [0, 1]$:

$$\Delta v_{launch, required} = \Delta v_{baseline} \cdot \left(1 - 0.40 \cdot \lambda_{ag}\right)$$

This provides up to a **40% reduction** in necessary propellant, permitting heavier scientific sensor suites to reach escape velocity.

### 1.3. Solar Flux & Electrical Power Balance
Solar array power generation scales strictly with the inverse-square law:

$$P_{generated} = N_{wings} \cdot P_{wing, 1AU} \cdot \left(\frac{1}{r_{AU}^2}\right) + N_{rtg} \cdot P_{rtg}$$

Where $P_{wing, 1AU} = 2.75\text{ kW}$ (modeled after the European Service Module on NASA Orion). At Jupiter ($5.2\text{ AU}$), solar flux drops to $\approx 3.7\%$ of Earth values, requiring either colossal array spans or RTG nuclear power.

---

## 2. 3D Scene Graph & Entity Implementation

### 2.1. Player Avatar Kinematics (`ForgeCity.tsx`)
Player navigation interpolates velocity vectors computed from keyboard or mobile analog touch controls:

```typescript
const inputVector = new THREE.Vector3(moveX, 0, moveZ);
if (inputVector.lengthSq() > 0) {
  if (inputVector.length() > 1) inputVector.normalize();
  playerVelocity.current.lerp(inputVector.multiplyScalar(speed), 0.25);
} else {
  playerVelocity.current.lerp(new THREE.Vector3(0, 0, 0), 0.25);
}
playerPos.current.add(playerVelocity.current);
```

### 2.2. Autonomous Traffic Simulation (`GitCityAssets.tsx`)
City avenues feature multi-lane autonomous vehicles navigating closed splines using parametric progress interpolation with smooth turn rotations and collision avoidance.

---

## 3. Mobile Touch Controller (`MobileTouchControls.tsx`)
- Reads continuous pointer gestures via touch events.
- Calculates radial displacement from joystick center with a $52\text{px}$ deadzone clamp.
- Emits normalized Cartesian directional coordinates directly to the Zustand store.
- Provides immediate tactile button responses for Sprint, Action [E], Inspect [I], and Voice Guidance.
