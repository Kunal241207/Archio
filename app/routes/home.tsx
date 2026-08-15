import type { Route } from "./+types/home";
import Navbar from "../../components/Navbar";
import { ArrowRight, Layers, ArrowUpRight, Clock, CloudUpload, Play, Sliders, Sun, RotateCcw } from "lucide-react";
import { Button } from "../../components/ui/Button";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Archio — Build beautiful spaces at the speed of thought" },
    { name: "description", content: "Archio is an AI-first design environment that helps you visualize, render, and ship architectural projects faster than ever." },
  ];
}

export default function Home() {
  return (
    <div className="home">
      <Navbar />

      <section className="hero">
        <span className="dot-accent dot-accent--left" aria-hidden="true" />
        <span className="dot-accent dot-accent--right" aria-hidden="true" />

        <div className="announce">
          <div className="dot">
            <div className="pulse" />
          </div>
          <p>Introducing Archio 1.0</p>
        </div>

        <h1>Build beautiful spaces at the speed of thought with Archio_</h1>

        <p className="subtitle">
          Archio is an AI-first design environment that helps you
          visualize, render, and ship architectural projects faster than ever.
        </p>

        <div className="actions">
          <a href="#upload" className="cta">
            Start Building <ArrowRight className="icon" />
          </a>
          <Button variant="outline" size="lg" className="demo">
            Watch Demo
          </Button>
        </div>

        <div id="upload" className="upload-shell">
          <div className="grid-overlay" aria-hidden="true" />

          <div className="shell-topbar">
            <div className="shell-topbar-left">
              <button className="shell-tool"><Play className="w-3.5 h-3.5" /></button>
              <div className="shell-divider" />
              <button className="shell-tool"><RotateCcw className="w-3.5 h-3.5" /></button>
              <button className="shell-tool"><Sliders className="w-3.5 h-3.5" /></button>
              <button className="shell-tool"><Sun className="w-3.5 h-3.5" /></button>
            </div>
            <div className="shell-topbar-right">
              <div className="shell-avatars">
                <span className="shell-avatar" style={{ background: "#f97316" }}>K</span>
                <span className="shell-avatar" style={{ background: "#3b82f6" }}>R</span>
                <span className="shell-avatar" style={{ background: "#8b5cf6" }}>M</span>
                <span className="shell-avatar-more">+</span>
              </div>
            </div>
          </div>

          <div className="upload-card">
            <div className="upload-icon-wrap">
              <Layers className="upload-brand-icon" />
            </div>
            <h3>Upload your floor plan</h3>
            <p className="upload-sub">Supports JPG, PNG up to 10 MB</p>

            <label className="dropzone" htmlFor="floor-plan-input">
              <input id="floor-plan-input" type="file" className="drop-input" accept="image/jpeg,image/png" />
              <div className="drop-content">
                <div className="drop-icon">
                  <CloudUpload className="w-5 h-5" />
                </div>
                <span className="drop-label">Click to upload or drag and drop</span>
              </div>
            </label>
          </div>
        </div>
      </section>

      <section className="projects">
        <div className="section-inner">
          <div className="section-head">
            <div className="copy">
              <h2>Projects</h2>
              <p>Your latest work and shared community projects, all in one place.</p>
            </div>
          </div>

          <div className="projects-grid">
            <div className="project-card group">
              <div className="preview">
                <img src="https://roomify-mlhuk267-dfwu1i.puter.site/projects/1770803585402/rendered.png" alt="project" />

                <div className="badge">
                  <span>Community</span>
                </div>
              </div>

              <div className="card-body">
                <div>
                  <h3>Project Rajasthan</h3>

                  <div className="meta">
                    <Clock size={14}/>
                    <span>{new Date().toLocaleDateString()}</span>
                    <span>By John Doe </span>
                  </div>
                </div>

                <div className="arrow">
                  <ArrowUpRight size={18} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}