const tabButtonsContainer = document.querySelector('.tab-btns');
const tabContent = document.querySelector('.tab-content');
let tabButtons;

window.onload = async function () {
  const categoryDetails = await fetch('https://openapi.programming-hero.com/api/videos/categories');
  const data = await categoryDetails.json();
  const categories = data.data;
  for (let category of categories) {
    let html = `<button class="btn tab-btn ${category.category}" onclick="openCategory(event,'${category.category_id}')">${category.category}</button>`;
    tabButtonsContainer.insertAdjacentHTML('beforeend', html);
  }
  tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons[0].click();
};

const currentTime = new Date();
let categoryData;

async function openCategory(event, categoryId) {
  const categoryResponse = await fetch(`https://openapi.programming-hero.com/api/videos/category/${categoryId}`);
  const categoryJson = await categoryResponse.json();
  categoryData = categoryJson.data;
  tabButtons.forEach(button => {
    button.classList.remove('active');
  });
  event.target.className += ' active';
  if (categoryData.length === 0) {
    tabContent.innerHTML = `No data found`;
    return;
  }
  renderList(categoryData);
}

function renderList(categoryData) {
  tabContent.innerHTML = '';
  categoryData.forEach(category => {
    const postDate = new Date(category.others.posted_date * 1);
    const currentDate = new Date();
    const timeDifference = currentDate - postDate;

    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

    let html = `<div class="youtube-list-item">
    <figure>
      <img src="${category.thumbnail}" alt="${category.title}" class="img-fluid" />
      ${category.others.posted_date ? `<p>${hours} hours ${minutes} minutes ago</p>` : ''}
    </figure>
    <div class="user-details">
      <div class="user-avatar">
        <img src="${category.authors[0]?.profile_picture}" alt="${category.title}" />
      </div>
      <div class="title-name-views">
        <h3>${category.title}</h3>
        <p>${category.authors[0].profile_name} ${category.authors[0].verified ? '<img src="images/verified.png" alt="verified"/>' : ''}</p>
        <p>${category.others.views}</p>
      </div>
    </div>
  </div>`;
    tabContent.insertAdjacentHTML('beforeend', html);
  });
}

document.getElementById('sort').addEventListener('click', () => {
  let sortedList = categoryData.sort((v1, v2) => {
    const view1 = parseFloat(v1.others.views);
    const view2 = parseFloat(v2.others.views);
    console.log(view1, view2);
    if (view1 > view2) return -1;
  });
  renderList(sortedList);
});
