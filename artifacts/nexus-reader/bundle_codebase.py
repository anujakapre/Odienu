import os

def bundle_codebase(root_dir='.', output_file='codebase.txt'):
    # Folders that make up 99% of the project size but don't contain source code
    ignore_dirs = {
        'node_modules', 
        '.expo', 
        '.git', 
        'android', 
        'ios', 
        'web-build', 
        'dist', 
        'build', 
        '.vscode'
    }

    # Only grab code and configuration text files
    include_extensions = {
        '.ts', '.tsx', '.js', '.jsx', '.json', '.md'
    }

    # Explicitly ignore locks or the output file itself to prevent infinite loops
    ignore_files = {
        'package-lock.json', 
        'yarn.lock', 
        'pnpm-lock.yaml', 
        output_file, 
        'bundle_codebase.py'
    }

    print("📁 Starting to scan and bundle your codebase files...")

    file_count = 0
    with open(output_file, 'w', encoding='utf-8') as outfile:
        for root, dirs, files in os.walk(root_dir):
            # Prune directories in place so os.walk doesn't dive into ignored folders
            dirs[:] = [d for d in dirs if d not in ignore_dirs]

            for file in files:
                if file in ignore_files:
                    continue

                _, ext = os.path.splitext(file)
                if ext.lower() in include_extensions:
                    full_path = os.path.join(root, file)
                    # Get clean relative paths (e.g. "app/(tabs)/index.tsx")
                    rel_path = os.path.relpath(full_path, root_dir)

                    # Write a clear markdown/text separator header for the AI
                    outfile.write(f"\n\n{'='*80}\n")
                    outfile.write(f"📂 FILE PATH: {rel_path}\n")
                    outfile.write(f"{'='*80}\n\n")

                    try:
                        with open(full_path, 'r', encoding='utf-8', errors='ignore') as infile:
                            outfile.write(infile.read())
                        file_count += 1
                        print(f"   ✅ Packed: {rel_path}")
                    except Exception as e:
                        print(f"   ❌ Could not read {rel_path}: {e}")

    print(f"\n🎉 Success! Combined {file_count} source files into a single document.")
    print(f"👉 Saved output to: {os.path.abspath(output_file)}")
    print("You can now drag-and-drop this single text file into Google AI Workspace!")

if __name__ == '__main__':
    bundle_codebase()
