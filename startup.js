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
gItemArray.push(itemObject);

if (!User.get()) {
  let stampx = new Date().getTime();
  let stamp = stampx.toString();
  User.set("GUEST" + stamp);
  createUser();

} else {
  Disk.loadCurrentData();
}

idUser.innerHTML = "<h6>" + User.get() + "</h6>";

idVersion.innerHTML = getVersion();

alertBox.addEventListener("animationend", () => { alertBox.classList.remove("animate"); });

if (mobile()) {
  let el = gid("panelData");
  el.remove();
  //hid(divDetails); hid(panelIntro);
  topDiv.appendChild(el);
}


window.onbeforeunload = function () {
  Disk.saveCurrentData();
  return null;
}
