<template>
  <div id="app">
    <ul>
      <li>
        <router-link to="/">/</router-link>
      </li>
      <li>
        <router-link to="/test-route">/test-route</router-link>
      </li>
    </ul>
    <router-view class="view"></router-view>
  </div>
</template>
