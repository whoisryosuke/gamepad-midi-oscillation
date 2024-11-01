import React, { CSSProperties, Suspense, useEffect, useRef } from "react";
import p5 from "p5";
import { useAppStore } from "../../store/app";
import { BASE_COLORS } from "themes/colors/base";
import createGridLines from "./shared/createGridLines";
import mapRange from "@/helpers/mapRange";

type Props = {
  width: CSSProperties["width"];
  height: CSSProperties["height"];
};

const P5WaveformLineShapeViz = ({ width, height, ...props }: Props) => {
  const p5ref = useRef<p5 | null>(null);
  const divRef = useRef<HTMLDivElement | null>(null);

  const Sketch = (p) => {
    let y = 100;
    let prevWave = 0;
    p.setup = () => {
      console.log("setup canvas");
      p.createCanvas(width ?? window.innerWidth, height ?? window.innerHeight);
      p.stroke(255); // Set line drawing color to white
      p.frameRate(30);
    };
    p.draw = () => {
      // console.log('drawing!!')
      p.background(p.color(BASE_COLORS["gray-9"])); // Set the background to black

      const { waveformOscLeft: waveform, colorMode } = useAppStore.getState();
      if (!waveform?.current) return;

      const levels = waveform.current.getValue();

      // BG Lines
      createGridLines(p, 15);

      // Setup the gradient using the Canvas ref
      const gradient = p.drawingContext.createLinearGradient(
        p.width / 2,
        0,
        p.width / 2,
        p.height
      );
      gradient.addColorStop(0, p.color(BASE_COLORS[`${colorMode}-4`]));
      gradient.addColorStop(1, p.color(BASE_COLORS["gray-9"]));

      // Apply gradient to the canvas fill
      p.drawingContext.fillStyle = gradient;

      // Line mesh thing
      p.beginShape();
      p.strokeWeight(2);
      p.stroke(BASE_COLORS[`${colorMode}-4`]);
      const width = Math.max(levels.length, p.width) / 2;

      for (let i = 0; i < width; i++) {
        if (levels[i - 1] < 0 && levels[i] >= 0) {
          prevWave = i;
          break;
        }
      }

      const end = width + prevWave;
      for (let i = prevWave; i < end; i++) {
        const normalized = levels[i] * 100;
        console.log(normalized);
        // p.vertex(i * 12, binMapped - 500);
        const halfwayDownScreen = p.height / 2;
        const amplitude = 1; // wave height
        const speed = 5; // more is slower
        const amplified = normalized * amplitude;
        const sin = p.sin(i / speed + p.millis() / 1000) * amplitude;

        const x = mapRange(i, prevWave, end, 0, p.width);
        const y = mapRange(
          normalized,
          -100,
          100,
          p.height / 4,
          (p.height / 4) * 3
        );

        // p.vertex(i, halfwayDownScreen - amplified);
        p.vertex(x, y);
      }
      // Since the stroke is 2px, we add a gap of that minimally so stroke doesn't show on bottom
      const GAP = 5;
      p.vertex(p.width, p.height + GAP);
      p.vertex(0, p.height + GAP);
      p.endShape();
    };
  };

  useEffect(() => {
    if (typeof window == "undefined") return;
    if (divRef.current && p5ref.current == null)
      p5ref.current = new p5(Sketch, divRef.current);
  }, []);

  return <div ref={divRef}></div>;
};

export default P5WaveformLineShapeViz;
