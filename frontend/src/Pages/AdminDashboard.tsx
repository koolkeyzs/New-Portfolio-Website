
import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  LayoutDashboard,
  UserRound,
  FolderKanban,
  Code2,
  Mail,
  LogOut,
  Menu,
  X,
  Plus,
  Pencil,
  Trash2,
  Eye,
  RefreshCw,
  LockKeyhole,
  ExternalLink,
  Save
} from "lucide-react";
import "./AdminDashboard.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

type Profile = {
  name: string;
  title: string[];
  bio: string;
  profileImage?: string;
  location?: string;
  email: string;
  githubUrl?: string;
  linkedinUrl?: string;
  resumeUrl?: string;
};

type ProfileForm = Omit<Profile, "title"> & {
  title: string;
};

type Project = {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  category?: string;
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  published?: boolean;
};

type Skill = {
  _id: string;
  name: string;
  category: string;
  icon?: string;
  proficiency?: number;
};

type Message = {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  isRead?: boolean;
  createdAt: string;
};

type ProjectForm = {
  title: string;
  description: string;
  technologies: string;
  category: string;
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  published: boolean;
};

type SkillForm = {
  name: string;
  category: string;
  icon: string;
  proficiency: number;
};

type ApiError = Error & { status?: number };

async function apiRequest<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const isFormData = options.body instanceof FormData;

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      data.message || `Request failed (${response.status})`
    ) as ApiError;

    error.status = response.status;
    throw error;
  }

  return data as T;
}

const emptyProjectForm: ProjectForm = {
  title: "",
  description: "",
  technologies: "",
  category: "",
  liveUrl: "",
  githubUrl: "",
  featured: false,
  published: true,
};

const emptySkillForm: SkillForm = {
  name: "",
  category: "",
  icon: "",
  proficiency: 80,
};

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [authChecking, setAuthChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const [projectFormOpen, setProjectFormOpen] = useState(false);
  const [skillFormOpen, setSkillFormOpen] = useState(false);

  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [editingSkill, setEditingSkill] = useState<string | null>(null);

  const [projectImage, setProjectImage] = useState<File | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const [projectForm, setProjectForm] =
    useState<ProjectForm>(emptyProjectForm);

  const [skillForm, setSkillForm] = useState<SkillForm>(emptySkillForm);

  const [profileForm, setProfileForm] = useState<ProfileForm>({
    name: "",
    title: "",
    bio: "",
    profileImage: "",
    location: "",
    email: "",
    githubUrl: "",
    linkedinUrl: "",
    resumeUrl: "",
  });

  const showNotice = (message: string) => {
    setNotice(message);
    setError("");
    window.setTimeout(() => setNotice(""), 3500);
  };

  const showError = (message: string) => {
    setError(message);
    setNotice("");
  };

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    const results = await Promise.allSettled([
      apiRequest<{ profile?: Profile }>("/api/profile"),
      apiRequest<{ projects?: Project[] }>("/api/projects"),
      apiRequest<{ skills?: Skill[] }>("/api/skills"),
      apiRequest<{ messages?: Message[] }>("/api/messages"),
    ]);

    const failures: string[] = [];

    if (results[0].status === "fulfilled") {
      const fetchedProfile = results[0].value.profile || null;
      setProfile(fetchedProfile);

      if (fetchedProfile) {
        setProfileForm({
          ...fetchedProfile,
          title: Array.isArray(fetchedProfile.title)
            ? fetchedProfile.title.join(", ")
            : "",
        });
      }
    } else {
      failures.push(`Profile: ${results[0].reason.message}`);
    }

    if (results[1].status === "fulfilled") {
      setProjects(results[1].value.projects || []);
    } else {
      failures.push(`Projects: ${results[1].reason.message}`);
    }

    if (results[2].status === "fulfilled") {
      setSkills(results[2].value.skills || []);
    } else {
      failures.push(`Skills: ${results[2].reason.message}`);
    }

    if (results[3].status === "fulfilled") {
      setMessages(results[3].value.messages || []);
    } else {
      failures.push(`Messages: ${results[3].reason.message}`);
    }

    if (failures.length) {
      showError(failures.join(" | "));
    }

    setLoading(false);
  }, []);

  const checkAuthentication = useCallback(async () => {
    setAuthChecking(true);

    try {
      await apiRequest("/api/auth/me");
      setIsAuthenticated(true);
      await loadDashboard();
    } catch (err) {
      const apiError = err as ApiError;

      setIsAuthenticated(false);

      if (apiError.status !== 401) {
        setLoginError(
          `Unable to reach the backend. Check that your API is running and your frontend API URL is correct. ${apiError.message}`
        );
      }
    } finally {
      setAuthChecking(false);
    }
  }, [loadDashboard]);

  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoginLoading(true);
    setLoginError("");

    try {
      await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      // Verify that the browser received and can send the authentication cookie.
      await apiRequest("/api/auth/me");

      setIsAuthenticated(true);
      setLoginPassword("");
      setActiveSection("overview");

      await loadDashboard();
    } catch (err) {
      const apiError = err as ApiError;
      setLoginError(apiError.message || "Login failed. Please try again.");
      setIsAuthenticated(false);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiRequest("/api/auth/logout", {
        method: "POST",
      });
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      setIsAuthenticated(false);
      setProfile(null);
      setProjects([]);
      setSkills([]);
      setMessages([]);
      setSelectedMessage(null);
      setActiveSection("overview");
      setSidebarOpen(false);
      setLoginEmail("");
      setLoginPassword("");
      setLoginError("");
      setNotice("");
      setError("");
    }
  };

  const handleProfileSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();

      formData.append("name", profileForm.name);

      formData.append(
        "title",
        JSON.stringify(
          profileForm.title
            .split(",")
            .map((title) => title.trim())
            .filter(Boolean)
        )
      );

      formData.append("bio", profileForm.bio);
      formData.append("location", profileForm.location || "");
      formData.append("email", profileForm.email);
      formData.append("githubUrl", profileForm.githubUrl || "");
      formData.append("linkedinUrl", profileForm.linkedinUrl || "");
      formData.append("resumeUrl", profileForm.resumeUrl || "");

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const response = await apiRequest<{ profile?: Profile }>(
        "/api/profile",
        {
          method: "PATCH",
          body: formData,
        }
      );

      if (response.profile) {
        setProfile(response.profile);

        setProfileForm({
          ...response.profile,
          title: Array.isArray(response.profile.title)
            ? response.profile.title.join(", ")
            : "",
        });
      }

      setProfileImage(null);
      showNotice("Profile updated successfully.");
    } catch (err) {
      showError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const openNewProjectForm = () => {
    setEditingProject(null);
    setProjectForm(emptyProjectForm);
    setProjectImage(null);
    setProjectFormOpen(true);
  };

  const openEditProjectForm = (project: Project) => {
    setEditingProject(project._id);
    setProjectForm({
      title: project.title || "",
      description: project.description || "",
      technologies: (project.technologies || []).join(", "),
      category: project.category || "",
      liveUrl: project.liveUrl || "",
      githubUrl: project.githubUrl || "",
      featured: Boolean(project.featured),
      published: project.published !== false,
    });
    setProjectImage(null);
    setProjectFormOpen(true);
  };

  const handleProjectSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();

      formData.append("title", projectForm.title);
      formData.append("description", projectForm.description);
      formData.append(
        "technologies",
        JSON.stringify(
          projectForm.technologies
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        )
      );
      formData.append("category", projectForm.category);

      if (projectForm.liveUrl.trim()) {
        formData.append("liveUrl", projectForm.liveUrl.trim());
      }

      if (projectForm.githubUrl.trim()) {
        formData.append("githubUrl", projectForm.githubUrl.trim());
      }

      formData.append("featured", String(projectForm.featured));
      formData.append("published", String(projectForm.published));

      if (projectImage) {
        formData.append("image", projectImage);
      }

      const path = editingProject
        ? `/api/projects/${editingProject}`
        : "/api/projects";

      await apiRequest(path, {
        method: editingProject ? "PATCH" : "POST",
        body: formData,
      });

      setProjectFormOpen(false);
      setEditingProject(null);
      setProjectImage(null);
      setProjectForm(emptyProjectForm);

      await loadDashboard();
      showNotice(editingProject ? "Project updated." : "Project created.");
    } catch (err) {
      showError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleProjectDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      await apiRequest(`/api/projects/${id}`, {
        method: "DELETE",
      });

      setProjects((current) => current.filter((project) => project._id !== id));
      showNotice("Project deleted.");
    } catch (err) {
      showError((err as Error).message);
    }
  };

  const openNewSkillForm = () => {
    setEditingSkill(null);
    setSkillForm(emptySkillForm);
    setSkillFormOpen(true);
  };

  const openEditSkillForm = (skill: Skill) => {
    setEditingSkill(skill._id);
    setSkillForm({
      name: skill.name || "",
      category: skill.category || "",
      icon: skill.icon || "",
      proficiency: skill.proficiency ?? 80,
    });
    setSkillFormOpen(true);
  };

  const handleSkillSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    try {
      const path = editingSkill
        ? `/api/skills/${editingSkill}`
        : "/api/skills";

      await apiRequest(path, {
        method: editingSkill ? "PATCH" : "POST",
        body: JSON.stringify(skillForm),
      });

      setSkillFormOpen(false);
      setEditingSkill(null);
      setSkillForm(emptySkillForm);

      await loadDashboard();
      showNotice(editingSkill ? "Skill updated." : "Skill added.");
    } catch (err) {
      showError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleSkillDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) {
      return;
    }

    try {
      await apiRequest(`/api/skills/${id}`, {
        method: "DELETE",
      });

      setSkills((current) => current.filter((skill) => skill._id !== id));
      showNotice("Skill deleted.");
    } catch (err) {
      showError((err as Error).message);
    }
  };

  const openMessage = async (message: Message) => {
    setSelectedMessage(message);

    try {
      const response = await apiRequest<{ message?: Message }>(
        `/api/messages/${message._id}`
      );

      if (response.message) {
        setSelectedMessage(response.message);
        setMessages((current) =>
          current.map((item) =>
            item._id === message._id
              ? { ...item, ...response.message, isRead: true }
              : item
          )
        );
      }
    } catch (err) {
      console.error("Unable to load message details:", err);
    }
  };

  const handleMessageDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this message?")) {
      return;
    }

    try {
      await apiRequest(`/api/messages/${id}`, {
        method: "DELETE",
      });

      setMessages((current) => current.filter((item) => item._id !== id));

      if (selectedMessage?._id === id) {
        setSelectedMessage(null);
      }

      showNotice("Message deleted.");
    } catch (err) {
      showError((err as Error).message);
    }
  };

  const unreadMessages = messages.filter((message) => !message.isRead).length;

  const navigation = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "profile", label: "Profile", icon: UserRound },
    { id: "projects", label: "Projects", icon: FolderKanban },
    { id: "skills", label: "Skills", icon: Code2 },
    { id: "messages", label: "Messages", icon: Mail, badge: unreadMessages },
  ];

  const changeSection = (section: string) => {
    setActiveSection(section);
    setSidebarOpen(false);
    setSelectedMessage(null);
    setProjectFormOpen(false);
    setSkillFormOpen(false);
  };

  if (authChecking) {
    return (
      <div className="admin-auth-screen">
        <div className="admin-auth-card admin-auth-loading">
          <div className="admin-spinner" />
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-auth-screen">
        <div className="admin-auth-card">
          <div className="admin-auth-brand">
            <div className="admin-auth-logo">K</div>
            <div>
              <h1>Admin Dashboard</h1>
              <p>Portfolio management</p>
            </div>
          </div>

          <div className="admin-auth-heading">
            <div className="admin-auth-icon">
              <LockKeyhole size={23} />
            </div>
            <h2>Welcome back</h2>
            <p>Sign in to manage your portfolio.</p>
          </div>

          {loginError && (
            <div className="admin-alert admin-alert-error">
              {loginError}
            </div>
          )}

          <form className="admin-auth-form" onSubmit={handleLogin}>
            <label htmlFor="admin-email">Email address</label>
            <input
              id="admin-email"
              type="email"
              value={loginEmail}
              onChange={(event) => setLoginEmail(event.target.value)}
              placeholder="Enter your admin email"
              autoComplete="username"
              required
            />

            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              value={loginPassword}
              onChange={(event) => setLoginPassword(event.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />

            <button
              type="submit"
              className="admin-btn admin-btn-primary admin-login-btn"
              disabled={loginLoading}
            >
              {loginLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="admin-auth-footer">
            This area is restricted to the portfolio administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {sidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="admin-sidebar-brand">
          <div className="admin-brand-mark">K</div>
          <div>
            <h2>Admin Panel</h2>
            <span>Portfolio manager</span>
          </div>
          <button
            className="admin-mobile-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="admin-nav-label">MANAGEMENT</div>

        <nav className="admin-nav">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                className={`admin-nav-item ${
                  activeSection === item.id ? "active" : ""
                }`}
                onClick={() => changeSection(item.id)}
              >
                <Icon size={19} />
                <span>{item.label}</span>
                {item.badge ? (
                  <span className="admin-nav-badge">{item.badge}</span>
                ) : null}
              </button>
            );
          })}
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-sidebar-status">
            <span className="admin-status-dot" />
            <span>Administrator signed in</span>
          </div>

          <button className="admin-logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              className="admin-menu-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            <div>
              <h1>
                {navigation.find((item) => item.id === activeSection)?.label}
              </h1>
              <p>Manage your portfolio content</p>
            </div>
          </div>

          <button
            className="admin-refresh-btn"
            onClick={loadDashboard}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? "spin" : ""} />
            <span>Refresh</span>
          </button>
        </header>

        <div className="admin-content">
          {notice && (
            <div className="admin-alert admin-alert-success">{notice}</div>
          )}

          {error && (
            <div className="admin-alert admin-alert-error">
              <span>{error}</span>
              <button onClick={() => setError("")} aria-label="Dismiss error">
                <X size={17} />
              </button>
            </div>
          )}

          {loading && (
            <div className="admin-loading-inline">
              <div className="admin-spinner" />
              <span>Loading dashboard data...</span>
            </div>
          )}

          {!loading && activeSection === "overview" && (
            <section>
              <div className="admin-welcome">
                <div>
                  <h2>Welcome to your dashboard</h2>
                  <p>
                    Here's an overview of your portfolio content and messages.
                  </p>
                </div>
              </div>

              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <div className="admin-stat-icon purple">
                    <FolderKanban size={21} />
                  </div>
                  <div>
                    <span>Total Projects</span>
                    <strong>{projects.length}</strong>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-icon blue">
                    <Code2 size={21} />
                  </div>
                  <div>
                    <span>Total Skills</span>
                    <strong>{skills.length}</strong>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-icon orange">
                    <Mail size={21} />
                  </div>
                  <div>
                    <span>Total Messages</span>
                    <strong>{messages.length}</strong>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-icon green">
                    <Eye size={21} />
                  </div>
                  <div>
                    <span>Unread Messages</span>
                    <strong>{unreadMessages}</strong>
                  </div>
                </div>
              </div>

              <div className="admin-panel">
                <div className="admin-panel-header">
                  <div>
                    <h3>Quick actions</h3>
                    <p>Manage the main areas of your portfolio.</p>
                  </div>
                </div>

                <div className="admin-quick-actions">
                  <button onClick={() => changeSection("profile")}>
                    <UserRound size={19} />
                    Edit profile
                  </button>
                  <button
                    onClick={() => {
                      changeSection("projects");
                      openNewProjectForm();
                    }}
                  >
                    <Plus size={19} />
                    Add project
                  </button>
                  <button
                    onClick={() => {
                      changeSection("skills");
                      openNewSkillForm();
                    }}
                  >
                    <Plus size={19} />
                    Add skill
                  </button>
                  <button onClick={() => changeSection("messages")}>
                    <Mail size={19} />
                    View messages
                  </button>
                </div>
              </div>

              <div className="admin-panel">
                <div className="admin-panel-header">
                  <div>
                    <h3>Recent messages</h3>
                    <p>Your latest portfolio enquiries.</p>
                  </div>
                  <button
                    className="admin-text-btn"
                    onClick={() => changeSection("messages")}
                  >
                    View all
                  </button>
                </div>

                {messages.length === 0 ? (
                  <p className="admin-empty">No messages yet.</p>
                ) : (
                  <div className="admin-message-list">
                    {messages.slice(0, 5).map((message) => (
                      <button
                        className="admin-message-row"
                        key={message._id}
                        onClick={() => {
                          changeSection("messages");
                          openMessage(message);
                        }}
                      >
                        <div className="admin-message-avatar">
                          {message.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <div className="admin-message-summary">
                          <strong>{message.name}</strong>
                          <span>{message.subject || message.message}</span>
                        </div>
                        {!message.isRead && (
                          <span className="admin-unread-dot" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {!loading && activeSection === "profile" && (
            <section className="admin-panel">
              <div className="admin-panel-header">
                <div>
                  <h3>Profile information</h3>
                  <p>Update the information displayed on your portfolio.</p>
                </div>
              </div>

              <form className="admin-form" onSubmit={handleProfileSave}>
                <div className="admin-form-grid">
                  <div className="admin-field">
                    <label htmlFor="profile-name">Full name</label>
                    <input
                      id="profile-name"
                      value={profileForm.name}
                      onChange={(event) =>
                        setProfileForm({
                          ...profileForm,
                          name: event.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="admin-field">
                    <label htmlFor="profile-email">Email address</label>
                    <input
                      id="profile-email"
                      type="email"
                      value={profileForm.email}
                      onChange={(event) =>
                        setProfileForm({
                          ...profileForm,
                          email: event.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="admin-field admin-field-full">
                    <label htmlFor="profile-title">
                      Professional titles (comma-separated)
                    </label>
                    <input
                      id="profile-title"
                      value={profileForm.title}
                      onChange={(event) =>
                        setProfileForm({
                          ...profileForm,
                          title: event.target.value,
                        })
                      }
                      placeholder="Software Developer, Backend Engineer"
                    />
                  </div>

                  <div className="admin-field admin-field-full">
                    <label htmlFor="profile-bio">Bio</label>
                    <textarea
                      id="profile-bio"
                      rows={6}
                      value={profileForm.bio}
                      onChange={(event) =>
                        setProfileForm({
                          ...profileForm,
                          bio: event.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="admin-field">
                    <label htmlFor="profile-location">Location</label>
                    <input
                      id="profile-location"
                      value={profileForm.location || ""}
                      onChange={(event) =>
                        setProfileForm({
                          ...profileForm,
                          location: event.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="admin-field">
                    <label htmlFor="profile-github">GitHub URL</label>
                    <input
                      id="profile-github"
                      type="url"
                      value={profileForm.githubUrl || ""}
                      onChange={(event) =>
                        setProfileForm({
                          ...profileForm,
                          githubUrl: event.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="admin-field">
                    <label htmlFor="profile-linkedin">LinkedIn URL</label>
                    <input
                      id="profile-linkedin"
                      type="url"
                      value={profileForm.linkedinUrl || ""}
                      onChange={(event) =>
                        setProfileForm({
                          ...profileForm,
                          linkedinUrl: event.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="admin-field">
                    <label htmlFor="profile-resume">Resume URL</label>
                    <input
                      id="profile-resume"
                      type="url"
                      value={profileForm.resumeUrl || ""}
                      onChange={(event) =>
                        setProfileForm({
                          ...profileForm,
                          resumeUrl: event.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="admin-field admin-field-full">
                    <label htmlFor="profile-image">Profile image</label>
                    {profile?.profileImage && (
                      <img
                        src={profile.profileImage}
                        alt="Current profile"
                        className="admin-current-image"
                      />
                    )}
                    <input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      onChange={(event) =>
                        setProfileImage(event.target.files?.[0] || null)
                      }
                    />
                    <small>
                      Select a new image to replace your current profile image.
                    </small>
                  </div>
                </div>

                <div className="admin-form-actions">
                  <button
                    className="admin-btn admin-btn-primary"
                    type="submit"
                    disabled={saving}
                  >
                    <Save size={17} />
                    {saving ? "Saving..." : "Save profile"}
                  </button>
                </div>
              </form>
            </section>
          )}

          {!loading && activeSection === "projects" && (
            <section>
              <div className="admin-section-heading">
                <div>
                  <h2>Projects</h2>
                  <p>Add, edit or remove portfolio projects.</p>
                </div>
                <button
                  className="admin-btn admin-btn-primary"
                  onClick={openNewProjectForm}
                >
                  <Plus size={17} />
                  Add project
                </button>
              </div>

              {projectFormOpen && (
                <div className="admin-panel admin-form-panel">
                  <div className="admin-panel-header">
                    <div>
                      <h3>
                        {editingProject ? "Edit project" : "Create project"}
                      </h3>
                      <p>Enter the project information below.</p>
                    </div>
                    <button
                      className="admin-icon-btn"
                      onClick={() => setProjectFormOpen(false)}
                      aria-label="Close form"
                    >
                      <X size={19} />
                    </button>
                  </div>

                  <form className="admin-form" onSubmit={handleProjectSave}>
                    <div className="admin-form-grid">
                      <div className="admin-field admin-field-full">
                        <label htmlFor="project-title">Project title</label>
                        <input
                          id="project-title"
                          value={projectForm.title}
                          onChange={(event) =>
                            setProjectForm({
                              ...projectForm,
                              title: event.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      <div className="admin-field admin-field-full">
                        <label htmlFor="project-description">Description</label>
                        <textarea
                          id="project-description"
                          rows={5}
                          value={projectForm.description}
                          onChange={(event) =>
                            setProjectForm({
                              ...projectForm,
                              description: event.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      <div className="admin-field">
                        <label htmlFor="project-technologies">
                          Technologies
                        </label>
                        <input
                          id="project-technologies"
                          value={projectForm.technologies}
                          onChange={(event) =>
                            setProjectForm({
                              ...projectForm,
                              technologies: event.target.value,
                            })
                          }
                          placeholder="React, Node.js, MongoDB"
                        />
                      </div>

                      <div className="admin-field">
                        <label htmlFor="project-category">Category</label>
                        <input
                          id="project-category"
                          value={projectForm.category}
                          onChange={(event) =>
                            setProjectForm({
                              ...projectForm,
                              category: event.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="admin-field">
                        <label htmlFor="project-live-url">Live Demo URL</label>
                        <input
                          id="project-live-url"
                          type="url"
                          value={projectForm.liveUrl}
                          onChange={(event) =>
                            setProjectForm({
                              ...projectForm,
                              liveUrl: event.target.value,
                            })
                          }
                          placeholder="https://your-project.vercel.app"
                        />
                      </div>

                      <div className="admin-field">
                        <label htmlFor="project-github-url">GitHub URL</label>
                        <input
                          id="project-github-url"
                          type="url"
                          value={projectForm.githubUrl}
                          onChange={(event) =>
                            setProjectForm({
                              ...projectForm,
                              githubUrl: event.target.value,
                            })
                          }
                          placeholder="https://github.com/username/repository"
                        />
                      </div>

                      <div className="admin-field admin-field-full">
                        <label htmlFor="project-image">Project image</label>
                        <input
                          id="project-image"
                          type="file"
                          accept="image/*"
                          onChange={(event) =>
                            setProjectImage(event.target.files?.[0] || null)
                          }
                        />
                      </div>
                    </div>

                    <div className="admin-checkbox-row">
                      <label>
                        <input
                          type="checkbox"
                          checked={projectForm.featured}
                          onChange={(event) =>
                            setProjectForm({
                              ...projectForm,
                              featured: event.target.checked,
                            })
                          }
                        />
                        Featured project
                      </label>

                      <label>
                        <input
                          type="checkbox"
                          checked={projectForm.published}
                          onChange={(event) =>
                            setProjectForm({
                              ...projectForm,
                              published: event.target.checked,
                            })
                          }
                        />
                        Published
                      </label>
                    </div>

                    <div className="admin-form-actions">
                      <button
                        type="button"
                        className="admin-btn admin-btn-secondary"
                        onClick={() => setProjectFormOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="admin-btn admin-btn-primary"
                        disabled={saving}
                      >
                        <Save size={17} />
                        {saving ? "Saving..." : "Save project"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {projects.length === 0 ? (
                <div className="admin-panel">
                  <p className="admin-empty">No projects found.</p>
                </div>
              ) : (
                <div className="admin-record-list">
                  {projects.map((project) => (
                    <article className="admin-project-card" key={project._id}>
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="admin-project-image"
                        />
                      ) : (
                        <div className="admin-project-image admin-project-placeholder">
                          <FolderKanban size={28} />
                        </div>
                      )}

                      <div className="admin-project-details">
                        <div className="admin-record-title">
                          <h3>{project.title}</h3>
                          <div className="admin-record-tags">
                            {project.featured && (
                              <span className="admin-tag featured">
                                Featured
                              </span>
                            )}
                            <span
                              className={`admin-tag ${
                                project.published ? "published" : "draft"
                              }`}
                            >
                              {project.published ? "Published" : "Draft"}
                            </span>
                          </div>
                        </div>

                        <p>{project.description}</p>

                        <div className="admin-tech-list">
                          {(project.technologies || []).map((technology) => (
                            <span key={technology}>{technology}</span>
                          ))}
                        </div>
                      </div>

                      <div className="admin-record-actions">
                        <button
                          className="admin-icon-btn"
                          onClick={() => openEditProjectForm(project)}
                          aria-label="Edit project"
                        >
                          <Pencil size={17} />
                        </button>
                        <button
                          className="admin-icon-btn danger"
                          onClick={() => handleProjectDelete(project._id)}
                          aria-label="Delete project"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {!loading && activeSection === "skills" && (
            <section>
              <div className="admin-section-heading">
                <div>
                  <h2>Skills</h2>
                  <p>Manage the skills displayed on your portfolio.</p>
                </div>
                <button
                  className="admin-btn admin-btn-primary"
                  onClick={openNewSkillForm}
                >
                  <Plus size={17} />
                  Add skill
                </button>
              </div>

              {skillFormOpen && (
                <div className="admin-panel admin-form-panel">
                  <div className="admin-panel-header">
                    <div>
                      <h3>{editingSkill ? "Edit skill" : "Add skill"}</h3>
                      <p>Enter the skill details below.</p>
                    </div>
                    <button
                      className="admin-icon-btn"
                      onClick={() => setSkillFormOpen(false)}
                      aria-label="Close form"
                    >
                      <X size={19} />
                    </button>
                  </div>

                  <form className="admin-form" onSubmit={handleSkillSave}>
                    <div className="admin-form-grid">
                      <div className="admin-field">
                        <label htmlFor="skill-name">Skill name</label>
                        <input
                          id="skill-name"
                          value={skillForm.name}
                          onChange={(event) =>
                            setSkillForm({
                              ...skillForm,
                              name: event.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      <div className="admin-field">
                        <label htmlFor="skill-category">Category</label>
                        <input
                          id="skill-category"
                          value={skillForm.category}
                          onChange={(event) =>
                            setSkillForm({
                              ...skillForm,
                              category: event.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      <div className="admin-field">
                        <label htmlFor="skill-icon">Icon (optional)</label>
                        <input
                          id="skill-icon"
                          value={skillForm.icon}
                          onChange={(event) =>
                            setSkillForm({
                              ...skillForm,
                              icon: event.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="admin-field">
                        <label htmlFor="skill-proficiency">
                          Proficiency ({skillForm.proficiency}%)
                        </label>
                        <input
                          id="skill-proficiency"
                          type="number"
                          min="0"
                          max="100"
                          value={skillForm.proficiency}
                          onChange={(event) =>
                            setSkillForm({
                              ...skillForm,
                              proficiency: Number(event.target.value),
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="admin-form-actions">
                      <button
                        type="button"
                        className="admin-btn admin-btn-secondary"
                        onClick={() => setSkillFormOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="admin-btn admin-btn-primary"
                        disabled={saving}
                      >
                        <Save size={17} />
                        {saving ? "Saving..." : "Save skill"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {skills.length === 0 ? (
                <div className="admin-panel">
                  <p className="admin-empty">No skills found.</p>
                </div>
              ) : (
                <div className="admin-skills-grid">
                  {skills.map((skill) => (
                    <article className="admin-skill-card" key={skill._id}>
                      <div className="admin-skill-top">
                        <div className="admin-skill-symbol">
                          <Code2 size={19} />
                        </div>
                        <div className="admin-record-actions">
                          <button
                            className="admin-icon-btn"
                            onClick={() => openEditSkillForm(skill)}
                            aria-label="Edit skill"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            className="admin-icon-btn danger"
                            onClick={() => handleSkillDelete(skill._id)}
                            aria-label="Delete skill"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <h3>{skill.name}</h3>
                      <p>{skill.category}</p>

                      {typeof skill.proficiency === "number" && (
                        <>
                          <div className="admin-skill-progress">
                            <span
                              style={{
                                width: `${Math.min(
                                  100,
                                  Math.max(0, skill.proficiency)
                                )}%`,
                              }}
                            />
                          </div>
                          <small>{skill.proficiency}%</small>
                        </>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {!loading && activeSection === "messages" && (
            <section>
              <div className="admin-section-heading">
                <div>
                  <h2>Messages</h2>
                  <p>View and manage messages sent through your portfolio.</p>
                </div>
                <span className="admin-message-count">
                  {messages.length} messages
                </span>
              </div>

              <div className="admin-messages-layout">
                <div className="admin-panel admin-inbox-panel">
                  {messages.length === 0 ? (
                    <p className="admin-empty">You have no messages yet.</p>
                  ) : (
                    <div className="admin-inbox-list">
                      {messages.map((message) => (
                        <button
                          key={message._id}
                          className={`admin-inbox-item ${
                            selectedMessage?._id === message._id
                              ? "selected"
                              : ""
                          }`}
                          onClick={() => openMessage(message)}
                        >
                          <div className="admin-message-avatar">
                            {message.name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <div className="admin-inbox-info">
                            <div className="admin-inbox-name">
                              <strong>{message.name}</strong>
                              {!message.isRead && (
                                <span className="admin-unread-dot" />
                              )}
                            </div>
                            <span>{message.subject || "No subject"}</span>
                            <small>
                              {new Date(message.createdAt).toLocaleDateString()}
                            </small>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="admin-panel admin-message-detail">
                  {selectedMessage ? (
                    <>
                      <div className="admin-panel-header">
                        <div>
                          <h3>
                            {selectedMessage.subject || "Message details"}
                          </h3>
                          <p>
                            Received{" "}
                            {new Date(
                              selectedMessage.createdAt
                            ).toLocaleString()}
                          </p>
                        </div>
                        <button
                          className="admin-icon-btn danger"
                          onClick={() =>
                            handleMessageDelete(selectedMessage._id)
                          }
                          aria-label="Delete message"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="admin-message-sender">
                        <div className="admin-message-avatar">
                          {selectedMessage.name
                            ?.charAt(0)
                            ?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <strong>{selectedMessage.name}</strong>
                          <a href={`mailto:${selectedMessage.email}`}>
                            {selectedMessage.email}
                          </a>
                        </div>
                      </div>

                      <div className="admin-message-body">
                        {selectedMessage.message}
                      </div>

                      <a
                        className="admin-btn admin-btn-primary admin-reply-btn"
                        href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(
                          `Re: ${selectedMessage.subject || "Your message"}`
                        )}`}
                      >
                        <Mail size={17} />
                        Reply by email
                        <ExternalLink size={15} />
                      </a>
                    </>
                  ) : (
                    <div className="admin-message-placeholder">
                      <Mail size={32} />
                      <h3>Select a message</h3>
                      <p>Choose a message from your inbox to read it.</p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
