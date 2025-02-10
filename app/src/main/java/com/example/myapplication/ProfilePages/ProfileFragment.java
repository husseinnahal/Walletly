package com.example.myapplication.ProfilePages;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.fragment.app.Fragment;

import com.example.myapplication.MainActivity;
import com.example.myapplication.R;
import com.example.myapplication.database.DatabaseConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class ProfileFragment extends Fragment {

    private TextView nameTextView;
    private TextView emailTextView;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.profile, container, false);

        nameTextView = rootView.findViewById(R.id.titletrainput);
        emailTextView = rootView.findViewById(R.id.email);

        SharedPreferences sharedPreferences = getActivity().getSharedPreferences("MyAppPrefs", Context.MODE_PRIVATE);
        int userId = sharedPreferences.getInt("userId", -1);

        if (userId != -1) {
            fetchUserData(userId);
        } else {
            Toast.makeText(getContext(), "User not logged in. Please log in.", Toast.LENGTH_SHORT).show();
        }

        // Logout functionality
        Button logoutButton = rootView.findViewById(R.id.logout);
        logoutButton.setOnClickListener(v -> {
            getActivity().getSharedPreferences("MyAppPrefs", Context.MODE_PRIVATE)
                    .edit()
                    .clear()
                    .apply();

            Intent intent = new Intent(getActivity(), MainActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
            startActivity(intent);
            getActivity().finish();
        });

        // Edit profile functionality
        Button editProfileButton = rootView.findViewById(R.id.editpro);
        editProfileButton.setOnClickListener(v -> {
            if (userId != -1) {
                Intent intent = new Intent(getActivity(), EditProfile.class);
                intent.putExtra("userId", userId);
                startActivity(intent);
            }
        });

        return rootView;
    }

    private void fetchUserData(int userId) {
        new FetchUserDataTask().execute(userId);
    }

    private class FetchUserDataTask extends AsyncTask<Integer, Void, String[]> {

        @Override
        protected String[] doInBackground(Integer... params) {
            int userId = params[0];
            Connection connection = DatabaseConnection.getConnection();
            String[] userData = new String[2]; // index 0 for name, 1 for email

            if (connection != null) {
                try {
                    String sql = "SELECT name, email FROM users WHERE id = ?";
                    PreparedStatement statement = connection.prepareStatement(sql);
                    statement.setInt(1, userId);

                    ResultSet resultSet = statement.executeQuery();

                    if (resultSet.next()) {
                        userData[0] = resultSet.getString("name");
                        userData[1] = resultSet.getString("email");
                    } else {
                        userData = null; // No user found
                    }

                    resultSet.close();
                    statement.close();
                    connection.close();
                } catch (SQLException e) {
                    Log.e("ProfileFragment", "SQL Exception: " + e.getMessage(), e);
                    return null;
                }
            }
            return userData;
        }

        @Override
        protected void onPostExecute(String[] userData) {
            if (userData != null) {
                nameTextView.setText(userData[0]);
                emailTextView.setText(userData[1]);
            } else {
                Toast.makeText(getContext(), "User details not found or database error", Toast.LENGTH_SHORT).show();
            }
        }
    }
}
