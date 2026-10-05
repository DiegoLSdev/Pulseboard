import "server-only";
import { vercelFetch } from "./vercel";

export type Project = {
    id: string;
    name: string;
    analyticsEnabled: boolean;
};

type ApiProject = {
    id: string;
    name: string;
    webAnalytics?: {
        enabledAt?: number;
    };
};

export async function listProjects(): Promise<Project[]> {
    const data = await vercelFetch("/v9/projects", { limit: "100" })
    const projects = data.projects.map((project: ApiProject) => ({
        id: project.id,
        name: project.name,
        analyticsEnabled: Boolean(project.webAnalytics?.enabledAt),
    }))
    return projects
}