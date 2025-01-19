package com.example.myapplication.ProfilePages;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.fragment.app.Fragment;

import com.example.myapplication.MainActivity;
import com.example.myapplication.R;
import com.example.myapplication.database.DatabaseHelper;

public class ProfileFragment extends Fragment {

    private TextView nameTextView;
    private TextView emailTextView;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.profile, container, false);

        nameTextView = rootView.findViewById(R.id.name);
        emailTextView = rootView.findViewById(R.id.email);

        int userId = getActivity()
                .getSharedPreferences("UserPrefs", getContext().MODE_PRIVATE)
                .getInt("userId", -1);

        if (userId != -1) {
            fetchUserData(userId);
        } else {
            Toast.makeText(getContext(), "User not logged in. Please log in.", Toast.LENGTH_SHORT).show();
        }

        // Logout button functionality
        Button logoutButton = rootView.findViewById(R.id.logout);
        logoutButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                getActivity().getSharedPreferences("UserPrefs", getContext().MODE_PRIVATE)
                        .edit()
                        .clear()
                        .apply();


                Intent intent = new Intent(getActivity(), MainActivity.class);
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                startActivity(intent);

                getActivity().finish();
            }
        });


        Button editProButton = rootView.findViewById(R.id.editpro);
        editProButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getActivity(), EditProfile.class);

                intent.putExtra("userId", userId);
                startActivity(intent);
            }
        });

        return rootView;
    }

    private void fetchUserData(int userId) {
        DatabaseHelper databaseHelper = new DatabaseHelper(getContext());
        SQLiteDatabase db = databaseHelper.getReadableDatabase();
        Cursor cursor = db.rawQuery("SELECT name, email FROM Users WHERE id = ?", new String[]{String.valueOf(userId)});

        if (cursor != null && cursor.moveToFirst()) {
            @SuppressLint("Range") String name = cursor.getString(cursor.getColumnIndex("name"));
            @SuppressLint("Range") String email = cursor.getString(cursor.getColumnIndex("email"));

            // Set the values in TextViews
            nameTextView.setText(name);
            emailTextView.setText(email);
            cursor.close();
        } else {
            Toast.makeText(getContext(), "User details not found", Toast.LENGTH_SHORT).show();
        }
    }
}
