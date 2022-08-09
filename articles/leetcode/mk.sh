
name=$1

fileLength=$(cat ./index.md | wc -l)

n=$(expr $fileLength - 1)

filename="${name}.md"
str="${n}. [${name}](./${filename})"
echo $str >> ./index.md

touch $filename

echo "## ${filename} \n \`\`\`js \n \`\`\`" >> "./${filename}"
