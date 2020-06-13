export interface PackageConfig {
    name: string;
    version: string;
    license: string;
    private?: boolean;
    workspaces?: string[];
    scripts?: Record<string, string>;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
}
