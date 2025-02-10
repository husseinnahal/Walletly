plugins {
    alias(libs.plugins.android.application)
}

android {
    namespace = "com.example.myapplication"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.example.myapplication"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

}

dependencies {
    implementation(libs.appcompat.v131)
    implementation(libs.material.v140)
    implementation(libs.activity.v123)
    implementation(libs.constraintlayout.v210)
    implementation(libs.ext.junit)
    testImplementation(libs.junit)
    androidTestImplementation(libs.espresso.core.v340)

    // MySQL Connector
//    implementation (libs.mysql.connector.java.v8030)
  implementation(libs.mysql.connector.java.v5149)
}
