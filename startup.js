const itemObject = {
  id: "0",
  type: "c",
  parentId: "?",
  name: "home",
  description: "your humble abode",
  image: "?"
};


const gShowOptions = {
  filter: "a",
  sort: "o",
  view: "g"

}



let gCurrentParentId = 0;
function getCurrentParentId() { return gCurrentParentId; }
function setCurrentParentId(id) { gCurrentParentId = id }

let gItemArray = [];
let gChainArray = [];

gItemArray.push(itemObject);

if (!User.get()) {
  let stampx = new Date().getTime();
  let stamp = stampx.toString();
  User.set("GUEST" + stamp);

  createUser();

} else {
  loadDataFromDisk();
}

gid("idUser").innerHTML = "<h6>" + User.get() + "</h6>";

alertBox.addEventListener("animationend", () => { alertBox.classList.remove("animate"); });

if (screen.width<500) {
  topDiv.appendChild(panelData);
  topDiv.appendChild(panelData);
}


window.onbeforeunload = function () {
  // Utils.doDebug("autosave " + text);
  saveDataToDisk();
  return null;
}
