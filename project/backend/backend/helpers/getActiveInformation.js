getActiveInformation = (data, arrayInformation) => {
    data.forEach(data => {
        arrayInformation.forEach(element => {
            if (element.activeTypeId = data.roleActive) {
                data.roleActive = element.activeTypeName
            }
        });
    });
}
module.exports = getActiveInformation;