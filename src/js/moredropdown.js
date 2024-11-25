function updateSelectedOption(option, menuId) {
  document.getElementById('selected-output').innerText = `You selected: ${option}`;
  document.getElementById(menuId).classList.remove('show');
}

document.getElementById('kategoridropdown').addEventListener('change', function () {
  if (this.value) {
      document.getElementById('menu1').classList.add('show');
  } else {
      document.getElementById('menu1').classList.remove('show');
  }
});

document.getElementById('dropdown2').addEventListener('change', function () {
  if (this.value) {
      document.getElementById('menu2').classList.add('show');
  } else {
      document.getElementById('menu2').classList.remove('show');
  }
});
