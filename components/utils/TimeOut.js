function TimeOutButtonZero(DisabledAttack, lastAtkBtnID, cooldownTime){
    setTimeout(() => {
        DisabledAttack[0].yes = false;
        DisabledAttack[0].name = "";
        document.getElementById(lastAtkBtnID).style.color = "white";
    }, cooldownTime);
};

function TimeOutButtonOne(DisabledAttack, lastAtkBtnID, cooldownTime){
    setTimeout(() => {
        DisabledAttack[1].yes = false;
        DisabledAttack[1].name = "";
        document.getElementById(lastAtkBtnID).style.color = "white";
    }, cooldownTime);
};

export { TimeOutButtonZero, TimeOutButtonOne };