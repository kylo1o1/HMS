const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 70%, 40%)`;
    return color;
  };
  
  const getInitials = (name) => {
    return name.split(' ').map(part => part[0]).join('').toUpperCase();
  };

module.exports = {
    stringToColor,
    getInitials
}