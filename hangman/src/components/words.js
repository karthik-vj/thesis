var progLang = ["HTML","PYTHON","CSS","Machine Learning","JAVA"]

function randomWord(){

    return progLang[Math.floor(Math.random()*progLang.length)]
}
export{randomWord}