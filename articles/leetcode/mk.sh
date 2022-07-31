n=$1
name=$2

filename="${name}.md"
str="${n}. [${name}](./${filename})"

echo $str >> ./index.md
touch $filename