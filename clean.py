import os
import glob
import emoji

# Find all relevant files
files = glob.glob('src/**/*.md', recursive=True)
files.extend(glob.glob('src/**/*.ts', recursive=True))
files.extend(glob.glob('src/**/*.tsx', recursive=True))
files.extend(glob.glob('src/**/*.astro', recursive=True))

for file_path in files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove emojis
    clean_content = emoji.replace_emoji(content, replace='')

    # Dyslexia-friendly punctuation:
    # Replace em-dash (—) and en-dash (–) with commas or periods
    clean_content = clean_content.replace('—', ',')
    clean_content = clean_content.replace('–', ',')
    
    # Sometimes we had things like " - " which can also be distracting
    # Let's replace " - " with ", " for smoother reading flow in these notes
    clean_content = clean_content.replace(' - ', ', ')

    if clean_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(clean_content)
        print(f"Cleaned {file_path}")

print("Done cleaning files.")