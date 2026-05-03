function getObsidianImageURI(img) {
    let imgNode = dv.paragraph(`<img src="${img}"/>`)
    imgNode.remove()
    //two of em cus theres a span
    return imgNode.childNodes[0].childNodes[0].src
}

/////////////////////////////////////////////////

const characters = dv.pages('"01 Characters"')
    .where(p => {return (p.file.ext == "md" && p.job)})

let table = dv.el("table", "", { cls: "navbox", attr: { cellspacing: 0 }})

let html = `
<tbody>
    <tr>
        <td style="padding:2px!important;">
            <table class="navbox-inner">
                <tbody>  
                    <tr>
                        <th class="navbox-header" colspan="2">
                            <span style="font-size:110%">Characters</span>
                        </th>
                    </tr>
                    ==CONTENT==
                </tbody>
            </table>
        </td>
    </tr>
</tbody>
`

let navgroups = []

let grpIdx = 1
for (let group of characters.groupBy(p => p.origin)) {
    let navHTML = `
<tr colspan="2" class="inbetween-padding"><td></td></tr>
<tr>
    <th class="navbox-group">${group.key}</td>
    <td class="navbox-list ${(Math.abs(grpIdx % 2 == 0)) ? 'odd' : 'even'}">
        <div style="display:flex;flex-wrap:wrap;">
            ==CHARACTERS==
        </div>
    </td>
</tr>`;
    let charsHTML;
    let charsArr = [];

    group.rows.file.forEach(f => {
        console.log(f)
	    charsArr.push(`
<a href="${f.link.path}" data-label="${f.link.path}" class="internal-link">
    <div class="card">
        <img src="${getObsidianImageURI('99 Meta/02 Image Assets/character_icons/'+f.name+'.png')}"/>
        <img class="card-job" src="${getObsidianImageURI('99 Meta/02 Image Assets/job_icons/'+f.frontmatter.job+'.png')}"/>
    </div>
</a>`)
    })
    //<a href="${f.link.path}" data-label="${f.link.path}" class="internal-link">${f.name}</a>
    charsHTML = charsArr.join("")

    navHTML = navHTML.replace("==CHARACTERS==", charsHTML)
    navgroups.push(navHTML)
    grpIdx++
}

html = html.replace("==CONTENT==", navgroups.join("\n"))

html = html.split("\n")

html.forEach((itm,idx,arr) => {arr[idx] = itm.trimStart()})
html = html.join("")

table.innerHTML = html