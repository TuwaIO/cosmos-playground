#!/usr/bin/env node

import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'path';
import prompts from 'prompts';

const REPO_URL = 'TuwaIO/cosmos-playground/examples';

async function main() {
  console.log('✨ Creating a new Cosmos Playground project...');

  const availableTemplates = [
    'nextjs-tuwa',
    'nextjs-connectkit',
    'nextjs-rainbowkit',
    'nextjs-solana',
    'nextjs-evm',
    'vite-tuwa',
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

    // Use npx to invoke degit locally
    const degitSource = `${REPO_URL}/${template}`;
    await execa('npx', ['degit', degitSource, projectPath], { stdio: 'inherit' });

    console.log(`\n🎉 Your new project "${projectName}" has been created!`);
    console.log(`\n📦 Installing dependencies with pnpm...`);
    await execa('pnpm', ['install'], { cwd: projectPath, stdio: 'inherit' });

    console.log(`\nDone! Next steps:`);
    console.log(`cd ./${projectName}`);
    console.log(`pnpm dev`);
  } catch (error) {
    console.error(`\n❌ An error occurred: ${error}`);
    process.exit(1);
  }
}

main().catch(console.error);
