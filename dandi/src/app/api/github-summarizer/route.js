import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
  const apiKey = req.headers.get('x-api-key');
  const { data, error } = await supabase
    .from('api_keys')
    .select('id')
    .eq('api_key', apiKey)
    .single();

  if (error) {
    return NextResponse.json({ Message: "API key is invalid" });
  } 
  console.log("API key is valid");

  const { githubUrl } = await req.json();
  const readmeContent = await getReadmeContent(githubUrl);
  console.log("readmeContent!!!!");
  console.log(readmeContent);
  return NextResponse.json({ Message: "API key is valid" });
  
} 

async function getReadmeContent(githubUrl) {
  try {
    // Extract owner and repo from the GitHub URL
    const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)(\/|$)/);
    if (!match) {
      throw new Error('Invalid GitHub repository URL');
    }
    const owner = match[1];
    const repo = match[2];

    // Try to fetch the README from the main branch first, then fallback to master
    const branches = ['main', 'master'];
    let response, readmeContent = null;

    for (const branch of branches) {
      const apiUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`;
      response = await fetch(apiUrl);
      if (response.ok) {
        readmeContent = await response.text();
        break;
      }
    }

    if (!readmeContent) {
      throw new Error('README.md not found in main or master branch');
    }

    return readmeContent;
  } catch (error) {
    return null;
  }
}
