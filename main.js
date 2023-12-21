const getEl = (el) => document.getElementById(el);

const body = document.body;
const themeSwitchBtn = getEl("switchThemeBtn");
const submit = getEl("submit");
const ThemeSwitchTxt = getEl("theme-switch-text");
const SearchError = getEl("search-error");
const EmptyField = getEl("empty-field");
const moonIcon = getEl("moon");
const sunIcon = getEl("sun");

function submitForm(e) {
  e.preventDefault();

  SearchError.classList.add("hidden");
  EmptyField.classList.add("hidden");

  const githubUsernameEl = getEl("github-username");
  githubUsernameEl.value = githubUsernameEl.value?.trim();
  const githubUsername = githubUsernameEl.value ?? "";

  if (!githubUsername.length) {
    EmptyField.classList.remove("hidden");
  } else {
    const githubUsernameJoined = githubUsername.split(" ").join("");
    fetchUser(githubUsernameJoined);
  }
}
submit.addEventListener("submit", submitForm);
async function fetchUser(username) {
  SearchError.classList.add("hidden");

  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    const parsedResponse = await response.json();

    if (!response.ok) {
      return SearchError.classList.remove("hidden");
    }

    return updateDOM(parsedResponse);
  } catch (err) {
    return console.log(err);
  }
}

function updateDOM(user) {
  const joinedAt = user.created_at.split("T")[0];
  const parsedJoinedAt = joinedAt.split("-");

  const year = parsedJoinedAt[0];
  const month = parsedJoinedAt[1];
  const day = parsedJoinedAt[2];

  const date = new Date(year, month, day);
  date.setMonth(month - 1);

  const monthTxt = date.toLocaleString("en", { month: "short" });

  const userImg = getEl("user-img");
  const userImgMobile = getEl("user-img-mobile");

  const userName = getEl("user-name");
  const userTimeJoined = getEl("user-joined-time");
  const userUsername = getEl("user-username");

  const userBio = getEl("user-bio");

  const userRepos = getEl("user-repos");
  const userFollowers = getEl("user-followers");
  const userFollowing = getEl("user-following");

  const userLocation = getEl("user-location");
  const userTwitter = getEl("user-twitter");
  const userWebsite = getEl("user-website");
  const userOrganization = getEl("user-organization");

  userImg.src = user.avatar_url;
  userImgMobile.src = user.avatar_url;

  userTimeJoined.dateTime = joinedAt;
  userTimeJoined.innerText = `Joined ${day} ${monthTxt} ${year}`;

  if (!user.name || user.name.length < 1) {
    userName.innerText = user.login;
  } else {
    userName.innerText = user.name;
  }
  userUsername.innerText = `@${user.login}`;

  if (!user.bio || user.bio.length < 1) {
    userBio.classList.add("opacity-75");
    userBio.innerText = "This profile has no bio";
  } else {
    userBio.classList.remove("opacity-75");
    userBio.innerText = user.bio;
  }

  userRepos.innerText = user.public_repos;
  userFollowers.innerText = user.followers;
  userFollowing.innerText = user.following;

  if (!user.location || user.location.length < 1) {
    userLocation.classList.add("opacity-50");
    userLocation.querySelector(".user-link").innerText = "Not Available";
  } else {
    userLocation.classList.remove("opacity-50");
    userLocation.querySelector(".user-link").innerText = user.location;
  }

  if (!user.twitter_username || user.twitter_username.length < 1) {
    userTwitter.classList.add("opacity-50");
    userTwitter.querySelector(".user-link").innerText = "Not Available";
    userTwitter.querySelector(".user-link").removeAttribute("href");
  } else {
    userTwitter.classList.remove("opacity-50");
    userTwitter.querySelector(
      ".user-link"
    ).innerText = `@${user.twitter_username}`;
    userTwitter.querySelector(
      ".user-link"
    ).href = `https://twitter.com/${user.twitter_username}`;
  }

  if (!user.blog || user.blog.length < 1) {
    userWebsite.classList.add("opacity-50");
    userWebsite.querySelector(".user-link").innerText = "Not Available";
    userWebsite.querySelector(".user-link").removeAttribute("href");
  } else {
    const userWebsiteShort = user.blog.split("/")[2];

    userWebsite.classList.remove("opacity-50");
    userWebsite.querySelector(".user-link").innerText = userWebsiteShort;
    userWebsite.querySelector(".user-link").href = user.blog;
  }

  if (!user.company || user.company.length < 1) {
    userOrganization.classList.add("opacity-50");
    userOrganization.querySelector(".user-link").innerText = "Not Available";
    userOrganization.querySelector(".user-link").removeAttribute("href");
  } else {
    const userOrganizationWithoutAt = user.company.split("@")[1];

    userOrganization.classList.remove("opacity-50");
    userOrganization.querySelector(".user-link").innerText = user.company;
    userOrganization.querySelector(
      ".user-link"
    ).href = `https://github.com/${userOrganizationWithoutAt}`;
  }
}

function updateThemeClasses(themeToSwitchTo) {
  sunIcon.classList.add("hidden");
  moonIcon.classList.add("hidden");

  if (themeToSwitchTo === "dark") {
    sunIcon.classList.remove("hidden");
    return body.classList.add("dark-theme");
  }

  moonIcon.classList.remove("hidden");
  body.classList.remove("dark-theme");
}

function switchTheme() {
  if (body.classList.contains("dark-theme")) {
    ThemeSwitchTxt.innerText = "Dark";

    localStorage.setItem("theme", "light");

    return updateThemeClasses("light");
  } else {
    ThemeSwitchTxt.innerText = "Light";

    localStorage.setItem("theme", "dark");

    return updateThemeClasses("dark");
  }
}
themeSwitchBtn.addEventListener("click", switchTheme);
function initTheme() {
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
  const storedTheme = localStorage.getItem("theme");

  if (storedTheme === "dark") {
    ThemeSwitchTxt.innerText = "Light";

    return updateThemeClasses("dark");
  }

  if (storedTheme === "light") {
    ThemeSwitchTxt.innerText = "Dark";

    return updateThemeClasses("light");
  }

  if (prefersDarkScheme.matches) {
    ThemeSwitchTxt.innerText = "Dark";

    return updateThemeClasses("dark");
  }
}

fetchUser("accauntforwork");

initTheme();
