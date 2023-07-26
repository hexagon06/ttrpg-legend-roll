<!-- template for the modal component -->
<template>
  <div class="fixed z-[9998] top-0 left-0 w-full h-full bg-black bg-opacity-50 transition-opacity flex justify-center">
    <div class="self-center flex">
      <div class="w-80 mx-0 my-auto px-5 py-5 bg-brown-light-300 shadow-lg transition-all">
        <div class="mt-0">
          <slot name="header">
            default header
          </slot>
        </div>

        <div class="mx-5 my-0">
          <slot name="body">
            default body
          </slot>
        </div>

        <div>
          <slot name="footer">
            <button class="float-right btn"
                    @click="$emit('close')">
              OK
            </button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* source https://codepen.io/immarina/pen/oNxXWKa

 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
