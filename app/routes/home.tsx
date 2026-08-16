import type { Route } from "./+types/home";
import Navbar from "../../components/Navbar";
import { ArrowRight, Layers, ArrowUpRight, Clock, Play, Sliders, Sun, RotateCcw } from "lucide-react";
import Upload from "../../components/Upload";
import { Button } from "../../components/ui/Button";
import { useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import { createProject, getProjects } from "../../lib/puter.action";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Archio — Build beautiful spaces at the speed of thought" },
    { name: "description", content: "Archio is an AI-first design environment that helps you visualize, render, and ship architectural projects faster than ever." },
  ];
}

export default function Home() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<DesignItem[]>([]);
  const isCreatingProjectRef = useRef(false);

  const handleUploadComplete = async(base64Image: string) => {
    if (isCreatingProjectRef.current) {
      console.warn("Project creation already in progress; ignoring upload");
      return false;
    }

    isCreatingProjectRef.current = true;

    try {
      const newId = Date.now().toString();
      const name = `Residence ${newId}`;

      const newItem = {
        id: newId,
        name,
        sourceImage: base64Image,
        renderedImage: undefined,
        timestamp: Date.now(),
      }

      const saved = await createProject({ item: newItem, visibility: "private" });
      if (!saved) {
        console.error("Failed to create project");
        return false;
      }

      setProjects((prev) => [saved, ...prev]);
      navigate(`/visualizer/${newId}`, { state: {
        initialImage: saved.sourceImage,
        initialRender: saved.renderedImage || null,
        name
      } });
      return true;
    } finally {
      isCreatingProjectRef.current = false;
    }
    
  };

  useEffect(() => {
    const fetchProjects = async () => {
      const items = await getProjects();
      setProjects(items);
    }
    fetchProjects();
  },[])
  
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

            <Upload onComplete={handleUploadComplete} />
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
            {projects.map(({id, name, sourceImage, renderedImage, timestamp}) => (
                <div key={id} className="project-card group" onClick={() => navigate(`/visualizer/${id}`)} >
                <div className="preview">
                  <img src={renderedImage || sourceImage} alt="project" />

                  <div className="badge">
                    <span>Community</span>
                  </div>
                </div>

                <div className="card-body">
                  <div>
                    <h3>{name}</h3>

                    <div className="meta">
                      <Clock size={14}/>
                      <span>{new Date(timestamp).toLocaleDateString()}</span>
                      <span>By John Doe </span>
                    </div>
                  </div>

                  <div className="arrow">
                    <ArrowUpRight size={18} />
                  </div>
                </div>
              </div>
            ))}
            
          </div>
        </div>
      </section>
    </div>
  );
}
