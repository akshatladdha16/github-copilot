function skillsMember() {
    var member = document.getElementById("member");
    var memberSkills = document.getElementById("memberSkills");
    var memberSkillsBtn = document.getElementById("memberSkillsBtn");
    var memberSkillsClose = document.getElementById("memberSkillsClose");

    memberSkillsBtn.onclick = function() {
        memberSkills.style.display = "block";
    }

    memberSkillsClose.onclick = function() {
        memberSkills.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == memberSkills) {
            memberSkills.style.display = "none";
        }
    }
}  