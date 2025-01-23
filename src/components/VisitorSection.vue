<script setup lang="ts">
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";

const DEFAULT_URL = "https://reurl.cc";
const inputBox = ref<HTMLInputElement>();
const inputValue = ref<string>("");
const urlPreview = ref<string>("");

function subimt() {
  try {
    const newUrl = predictRealUrl();
    if (typeof newUrl === "string") location.href = newUrl;
    else throw newUrl;
  } catch (error) {
    Swal.fire({
      title: "<ruby><rb>蛤</rb><rt>ㄍㄜˊ</rt></ruby>～",
      text: error.message,
      icon: "error",
    });
  }
}

function predictRealUrl() {
    let token = "";
    urlPreview.value = DEFAULT_URL;
  try {
    if (inputValue.value.trim() === "") {
      return new Error("你是空手來的嗎？");
    } else if ((window as any).isValidZhuyin(inputValue.value)) {
      token = inputValue.value;
    } else if (inputValue.value.startsWith("http")) {
      token = (window as any).extractQueryFromUrl(inputValue.value);
    } else {
      return new Error("我吃不出這是什麼網址");
    }
    const translated = (window as any).zhuyinToBase62(token);
    const newUrl = `https://reurl.cc/${translated}`;
    urlPreview.value = newUrl;
    return newUrl;
  } catch (error) {
    return new Error(error.message);
  }
}

function fillInIfUrlTokenExist() {
  try {
    const token = (window as any).extractQueryFromUrl(location.href);
    if (!token) return;
    inputValue.value = token;
  } catch (error) {}
}

onMounted(() => {
  inputBox.value.focus();
  fillInIfUrlTokenExist();
});
</script>

<template>
  <div class="input-section">
    <h2>解析短網址</h2>
    <input
      ref="inputBox"
      type="text"
      v-model="inputValue"
      placeholder="ㄗㄆㄌㄡㄒㄙㄏ"
      @input="predictRealUrl"
    />
    <button
      @click="subimt()"
      :disabled="!inputValue"
      :class="{ disabled: !inputValue }"
    >
      <span>前往</span>
    </button>
    <a class="preview-url" :href="urlPreview || DEFAULT_URL">{{
      urlPreview || DEFAULT_URL
    }}</a>
  </div>
</template>

<style scoped>
.input-section {
  flex: 1;
  padding: 3rem;
  box-sizing: border-box;
}

.input-section h2 {
  margin-bottom: 1rem;
}

.input-section input {
  width: 100%;
  padding: 0.5rem;
  background-color: white;
  color: black;
  box-sizing: border-box;
  border-radius: 0.5rem 0.5rem 0 0;
  text-align: center;
  font-size: x-large;
  &::placeholder {
    color: #ddd;
  }
}

.input-section button {
  width: 100%;
  padding: 1rem;
  background-color: rebeccapurple;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 0 0 0.5rem 0.5rem;
  &.disabled {
    background-color: #666;
    cursor: not-allowed;
  }
}

.input-section .preview-url {
  color: white;
}
</style>
