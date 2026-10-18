export class BranchItem {
  readonly id: string;
  readonly name: string;
  readonly fullName?: string;
  readonly role?: string;
  readonly projects: readonly string[];

  constructor(config: { id: string; name: string; fullName?: string; role?: string; projects: string[] }) {
    this.id = config.id;
    this.name = config.name;
    this.fullName = config.fullName;
    this.role = config.role;
    this.projects = config.projects;
  }

  get projectCount(): number {
    return this.projects.length;
  }

  get projectLabel(): string {
    return this.projectCount === 1 ? "פרויקט" : "פרויקטים";
  }
}
