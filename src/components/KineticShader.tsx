import { useEffect, useRef } from 'react';

interface KineticShaderProps {
  opacity?: number;
}

export default function KineticShader({ opacity = 0.6 }: KineticShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl: WebGLRenderingContext | null = null;
    try {
      gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
    } catch (e) {
      console.warn('WebGL not supported');
    }

    if (!gl) return;

    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      varying vec2 v_texCoord;
      uniform float u_time;
      uniform vec2 u_resolution;

      void main() {
        vec2 uv = v_texCoord;
        float speed = u_time * 0.18;
        vec2 p = uv * 2.0 - 1.0;
        p.x *= u_resolution.x / u_resolution.y;
        
        float pulse = sin(u_time * 0.4) * 0.1 + 0.9;
        
        float color = 0.0;
        for(float i = 1.0; i < 4.0; i++) {
          p.x += 0.3 / i * sin(i * 3.0 * p.y + speed);
          p.y += 0.3 / i * cos(i * 3.0 * p.x + speed);
          color += abs(0.012 / p.y) * pulse;
        }
        
        // Beautiful vibrant neon green matching GymFlow theme
        vec3 neonGreen = vec3(0.67, 0.84, 0.0); // #abd600
        vec3 bgColor = vec3(0.043, 0.051, 0.02); // Deep onyx slate
        
        vec3 finalColor = mix(bgColor, neonGreen, clamp(color * 0.14, 0.0, 0.35));
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const loadShader = (type: number, src: string) => {
      const shader = gl!.createShader(type);
      if (!shader) return null;
      gl!.shaderSource(shader, src);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        console.error('Shader compilation error: ', gl!.getShaderInfoLog(shader));
        gl!.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const shaderProgram = gl.createProgram();
    const vs = loadShader(gl.VERTEX_SHADER, vsSource);
    const fs = loadShader(gl.FRAGMENT_SHADER, fsSource);

    if (!shaderProgram || !vs || !fs) return;

    gl.attachShader(shaderProgram, vs);
    gl.attachShader(shaderProgram, fs);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error('Shader linking error: ', gl.getProgramInfoLog(shaderProgram));
      return;
    }

    gl.useProgram(shaderProgram);

    // Buffer setting
    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(shaderProgram, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(shaderProgram, 'u_time');
    const resLoc = gl.getUniformLocation(shaderProgram, 'u_resolution');

    let animationId: number;

    const resizeCanvas = () => {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const width = Math.floor(rect.width * dpr);
      const height = Math.floor(rect.height * dpr);

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl!.viewport(0, 0, width, height);
      }
    };

    // Monitor canvas sizes natively
    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    resizeObserver.observe(canvas);
    resizeCanvas();

    const render = (time: number) => {
      if (!gl || !canvas) return;
      gl.uniform1f(timeLoc, time * 0.001);
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      if (gl) {
        gl.deleteBuffer(positionBuffer);
        gl.deleteProgram(shaderProgram);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
      }
    };
  }, []);

  return (
    <canvas
      id="kinetic-kinetic-bg-shader"
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none transition-opacity duration-1000"
      style={{
        zIndex: -5,
        opacity,
        display: 'block',
      }}
    />
  );
}
