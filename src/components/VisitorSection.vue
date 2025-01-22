<script setup lang="ts">
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import { zhuyinToBase62, isValidZhuyin } from "../service";

const inputBox = ref<HTMLInputElement>();
const inputValue = ref<string>("");

function subimt() {
  let token = "";
  try {
    if (inputValue.value.trim() === "") {
      throw new Error("你是空手來的嗎？");
    } else if (isValidZhuyin(inputValue.value)) {
      token = inputValue.value;
    } else if (inputValue.value.startsWith("http")) {
      token = new URL(inputValue.value).searchParams.get("q");
    } else {
      throw new Error("我吃不出這是什麼網址");
    }
    const translated = zhuyinToBase62(token);
    const newUrl = `https://reurl.cc/${translated}`;
    location.href = newUrl;
  } catch (error) {
    Swal.fire({
      title: "<ruby><rb>蛤</rb><rt>ㄍㄜˊ</rt></ruby>～",
      text: error.message,
      icon: "error",
    });
  }
}

function fillInIfUrlTokenExist() {
  try {
    const token = new URL(location.href).searchParams.get("q");
    if (!token) return;
    inputValue.value = token;
    subimt();
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
    />
    <button
      @click="subimt()"
      :disabled="!inputValue"
      :class="{ disabled: !inputValue }"
    >
      <span>前往</span>
    </button>
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
</style>
