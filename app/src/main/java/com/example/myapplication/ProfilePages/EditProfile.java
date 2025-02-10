package com.example.myapplication.ProfilePages;

import android.content.Context;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.myapplication.R;
import com.example.myapplication.database.DatabaseConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class EditProfile extends AppCompatActivity {

    private EditText nameEditText;
    private EditText emailEditText;
    private int userId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.editprofile);

        nameEditText = findViewById(R.id.namefields);
        emailEditText = findViewById(R.id.emailfield);
        Button updateButton = findViewById(R.id.update);
        ImageView goBackButton = findViewById(R.id.returntext);

        userId = getSharedPreferences("MyAppPrefs", Context.MODE_PRIVATE).getInt("userId", -1);

        if (userId != -1) {
            fetchUserData(userId);
        } else {
            Toast.makeText(this, "User ID not found. Please try again.", Toast.LENGTH_SHORT).show();
        }

        goBackButton.setOnClickListener(v -> finish());
        updateButton.setOnClickListener(v -> updateUserData());
    }


    private void fetchUserData(int userId) {
        new FetchUserDataTask().execute(userId);
    }

    private class FetchUserDataTask extends AsyncTask<Integer, Void, String[]> {

        @Override
        protected String[] doInBackground(Integer... params) {
            int userId = params[0];
            String[] userData = new String[2];

            Connection connection = DatabaseConnection.getConnection();
            if (connection != null) {
                try {
                    String query = "SELECT name, email FROM users WHERE id = ?";
                    PreparedStatement statement = connection.prepareStatement(query);
                    statement.setInt(1, userId);

                    ResultSet resultSet = statement.executeQuery();
                    if (resultSet.next()) {
                        userData[0] = resultSet.getString("name");
                        userData[1] = resultSet.getString("email");
                    }

                    resultSet.close();
                    statement.close();
                    connection.close();
                } catch (SQLException e) {
                    Log.e("FetchUserDataTask", "Error fetching user data", e);
                }
            }

            return userData;
        }

        @Override
        protected void onPostExecute(String[] userData) {
            if (userData != null && userData[0] != null) {
                nameEditText.setText(userData[0]);
                emailEditText.setText(userData[1]);
            } else {
                Toast.makeText(EditProfile.this, "Failed to load user data", Toast.LENGTH_SHORT).show();
            }
        }
    }

    private void updateUserData() {
        String updatedName = nameEditText.getText().toString().trim();
        String updatedEmail = emailEditText.getText().toString().trim();

        if (updatedName.isEmpty() || updatedEmail.isEmpty()) {
            Toast.makeText(this, "Name and Email cannot be empty", Toast.LENGTH_SHORT).show();
            return;
        }

        // Validate email format
        if (!android.util.Patterns.EMAIL_ADDRESS.matcher(updatedEmail).matches()) {
            Toast.makeText(this, "Invalid email format", Toast.LENGTH_SHORT).show();
            return;
        }

        new UpdateUserDataTask().execute(updatedName, updatedEmail);
    }


    private class UpdateUserDataTask extends AsyncTask<String, Void, Boolean> {

        @Override
        protected Boolean doInBackground(String... params) {
            String updatedName = params[0];
            String updatedEmail = params[1];

            Connection connection = DatabaseConnection.getConnection();
            if (connection != null) {
                try {
                    String query = "UPDATE users SET name = ?, email = ? WHERE id = ?";
                    PreparedStatement statement = connection.prepareStatement(query);
                    statement.setString(1, updatedName);
                    statement.setString(2, updatedEmail);
                    statement.setInt(3, userId);

                    int rowsAffected = statement.executeUpdate();
                    statement.close();
                    connection.close();

                    return rowsAffected > 0;
                } catch (SQLException e) {
                    Log.e("UpdateUserDataTask", "Error updating user data", e);
                    return false;
                }
            }
            return false;
        }

        @Override
        protected void onPostExecute(Boolean success) {
            if (success) {
                Toast.makeText(EditProfile.this, "Profile updated successfully", Toast.LENGTH_SHORT).show();
                finish();
            } else {
                Toast.makeText(EditProfile.this, "Failed to update profile", Toast.LENGTH_SHORT).show();
            }
        }
    }
}

