<template>
  <div class="edit-profile-container">
    <img src="@/assets/images/PawfectHome.png" alt="Pawfect Home Logo" class="logo" />

    <h1>Edit Profile</h1>

    <div class="profile-image-container">
      <img :src="profileImage || defaultProfileImage" class="profile-image" alt="Profile Picture" />
    </div>

    <!-- Form Submission Prevents Page Reload -->
    <form @submit.prevent="updateProfile">
      <div class="editprofile-form">

        <div class="editprofile-input">
          <label>First Name</label>
          <input v-model="firstName" type="text" required placeholder="Ming" />
        </div>


        <div class="editprofile-input">
          <label>Last Name</label>
          <input v-model="lastName" type="text" required placeholder="Han" />
        </div>


        <div class="editprofile-input">
          <label>Email</label>
          <input v-model="email" type="email" required placeholder="woshivicecaptainoftraining@gmail.com" />
          <p v-if="email && !isEmailValid" class="error-message">Invalid email format</p>
        </div>


        <div class="editprofile-input">
          <label>Contact Number</label>
          <input v-model="contactNumber" type="text" required placeholder="91234567" />
          <p v-if="contactNumber && !isContactNumberValid" class="error-message">Invalid contact number</p>
        </div>

   
        <div class="editprofile-input">
          <label>Password</label>
          <input type="password" v-model="password" placeholder="**************" />
        </div>

        <!-- Reset Password Button -->
        <button type="button" class="reset-password-btn" @click="resetPassword">Reset Password</button>

      
        <div class="button-container">
          <button type="button" class="cancel-button" @click="cancelEdit">Cancel</button>
          <button type="submit" class="save-button">Save</button>
        </div>
      </div>
    </form>
  </div>
</template>

