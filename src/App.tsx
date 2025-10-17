import { Canvas } from "@react-three/fiber";
import {
  createXRStore,
  IfInSessionMode,
  useXRSessionModeSupported,
  XR,
} from "@react-three/xr";
import { useState } from "react";
import "./App.css";

const sessionMode: XRSessionMode = "immersive-ar";
const store = createXRStore();

export default function App() {
  const [isARSupported, setIsARSupported] = useState<boolean | null>(null);
  const browserSupported = useXRSessionModeSupported(sessionMode);

  async function handleCheckARManually() {
    if (!browserSupported || !navigator.xr) {
      setIsARSupported(false);
      return;
    }
    try {
      const session = await navigator.xr.requestSession(sessionMode, {
        requiredFeatures: ["local-floor"],
        optionalFeatures: ["hit-test"],
      });
      await session.end();
      setIsARSupported(true);
    } catch (err) {
      console.error("❌ AR failed:", err);
      setIsARSupported(false);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button type="button" onClick={handleCheckARManually}>
          Check AR Support
        </button>

        <button
          type="button"
          onClick={() => store.enterAR()}
          disabled={!isARSupported}
        >
          Open app
        </button>
      </div>

      <p>
        {isARSupported != null &&
          `AR is ${isARSupported ? "" : "not"} supported on this device`}
      </p>

      {isARSupported && (
        <Canvas>
          <XR store={store}>
            <IfInSessionMode deny={sessionMode}>
              {/*<color args={["red"]} attach="background" />*/}
            </IfInSessionMode>
          </XR>
        </Canvas>
      )}
    </div>
  );
}
