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

alertBox.addEventListener("animationend", () => { alertBox.classList.remove("animate"); });

if (mobile()) {

  hid(divImages); hid(divDetails); hid(panelIntro);
}


window.onbeforeunload = function () {
  Disk.saveCurrentData();
  return null;
}
