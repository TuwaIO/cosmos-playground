#!/usr/bin/env node

import degit from 'degit';
import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'path';
import prompts from 'prompts';

const REPO_URL = 'TuwaIO/cosmos-playground/examples';

type PackageManager = 'pnpm' | 'bun' | 'yarn' | 'npm' | null;

/**
 * Checks whether a specific CLI command is executable in the current environment.
 * @param command - The executable command name to verify.
 * @returns A promise resolving to true if the command succeeded, false otherwise.
 */
async function isCommandAvailable(command: string): Promise<boolean> {
  try {
    await execa(command, ['--version']);
    return true;
  } catch {
    return false;
  }
}

/**
 * Detects the best available package manager installed on the host machine.
 * Priority order: pnpm > bun > yarn > npm.
 * @returns The detected package manager or null if none was found.
 */
async function detectPackageManager(): Promise<PackageManager> {
  if (await isCommandAvailable('pnpm')) return 'pnpm';
  if (await isCommandAvailable('bun')) return 'bun';
  if (await isCommandAvailable('yarn')) return 'yarn';
  if (await isCommandAvailable('npm')) return 'npm';
  return null;
}

async function main() {
  console.log('✨ Creating a new Cosmos Playground project...');

  const availableTemplates = [
    'nextjs-tuwa-quasar',
    'custom-style',
    'nextjs-tuwa',
    'nextjs-solana',
    'nextjs-evm',
    'vite-tuwa',
    'nextjs-tuwa-not-sdk',
  ];

  const templateResponse = await prompts({
    type: 'select',
    name: 'template',
    message: 'Which template would you like to use?',
    choices: availableTemplates.map((template) => ({ title: template, value: template })),
    initial: 0,
  });

  const { template } = templateResponse;

  if (!template) {
    console.log('Aborting...');
    return;
  }

  const projectNameResponse = await prompts({
    type: 'text',
    name: 'projectName',
    message: `What is the name of your new project? (e.g., my-new-app)`,
    validate: (name) => (name.length > 0 ? true : `Project name cannot be empty.`),
  });

  const { projectName } = projectNameResponse;
  const projectPath = path.join(process.cwd(), projectName);

  if (fs.existsSync(projectPath)) {
    const overwriteResponse = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message: `Directory "${projectName}" already exists. Overwrite?`,
      initial: false,
    });

    if (!overwriteResponse.overwrite) {
      console.log('Aborting...');
      return;
    }

    await fs.remove(projectPath);
  }

  try {
    console.log(`\n⬇️ Downloading template "${template}" from GitHub...`);

    const degitSource = `${REPO_URL}/${template}`;
    try {
      const emitter = degit(degitSource, { cache: false, force: true });
      await emitter.clone(projectPath);
    } catch {
      // Fallback to npx degit if programmatic clone fails
      await execa('npx', ['degit', degitSource, projectPath], { stdio: 'inherit' });
    }

    console.log(`\n🎉 Your new project "${projectName}" has been created!`);

    const packageManager = await detectPackageManager();

    if (packageManager === 'pnpm') {
      // Ensure pnpm-workspace.yaml pre-configures known build scripts to avoid ERR_PNPM_IGNORED_BUILDS
      const workspaceYamlPath = path.join(projectPath, 'pnpm-workspace.yaml');
      if (!fs.existsSync(workspaceYamlPath)) {
        const defaultWorkspaceConfig = [
          'allowBuilds:',
          "  '@reown/appkit': true",
          '  esbuild: true',
          '',
        ].join('\n');
        await fs.writeFile(workspaceYamlPath, defaultWorkspaceConfig, 'utf-8');
      }

      console.log(`\n📦 Installing dependencies with pnpm...`);
      try {
        await execa('pnpm', ['install'], { cwd: projectPath, stdio: 'inherit' });
      } catch {
        console.log(`\n⚙️ Automatically approving dependency build scripts...`);
        await execa('pnpm', ['approve-builds', '--all'], { cwd: projectPath, stdio: 'inherit' });
        await execa('pnpm', ['install'], { cwd: projectPath, stdio: 'inherit' });
      }
    } else if (packageManager === 'npm') {
      console.log(`\n⚠️  Warning: pnpm is not detected on your system. Falling back to npm.`);
      console.log(`💡 We recommend installing pnpm for optimal performance: npm install -g pnpm`);
      console.log(`\n📦 Installing dependencies with npm...`);
      await execa('npm', ['install'], { cwd: projectPath, stdio: 'inherit' });
    } else if (packageManager === 'bun') {
      console.log(`\n⚠️  Warning: pnpm is not detected. Falling back to bun.`);
      console.log(`\n📦 Installing dependencies with bun...`);
      await execa('bun', ['install'], { cwd: projectPath, stdio: 'inherit' });
    } else if (packageManager === 'yarn') {
      console.log(`\n⚠️  Warning: pnpm is not detected. Falling back to yarn.`);
      console.log(`\n📦 Installing dependencies with yarn...`);
      await execa('yarn', ['install'], { cwd: projectPath, stdio: 'inherit' });
    } else {
      console.log(`\n⚠️  Warning: No supported package manager (pnpm, npm, bun, yarn) detected on your system.`);
      console.log(`📁 Project template was successfully cloned into ./${projectName}`);
      console.log(`\n💡 To complete setup:`);
      console.log(`1. Install pnpm (recommended: https://pnpm.io/installation) or Node.js / npm`);
      console.log(`2. cd ./${projectName}`);
      console.log(`3. pnpm install && pnpm dev`);
      return;
    }

    const devCommand = packageManager === 'npm' ? 'npm run dev' : `${packageManager} dev`;

    console.log(`\n✅ Done! Next steps:`);
    console.log(`cd ./${projectName}`);
    console.log(`${devCommand}`);

    console.log(`\n---------------------------------------------------------`);
    console.log(`💡 Troubleshooting:`);
    console.log(`If you find that the downloaded files are "Read-only" and you cannot edit them,`);
    console.log(`please change the directory permissions by running:`);
    console.log(`sudo chmod -R 777 ./`);

    console.log(`\n❤️  Support us:`);
    console.log(`If you enjoy using TUWA, please give us a star on GitHub:`);
    console.log(`https://github.com/TuwaIO/nova-uikit`);
    console.log(`---------------------------------------------------------`);

  } catch (error) {
    console.error(`\n❌ An error occurred: ${error}`);
    process.exit(1);
  }
}

main().catch(console.error);