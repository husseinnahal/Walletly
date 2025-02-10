package com.example.myapplication;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.myapplication.database.DatabaseConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class SavingFragment extends Fragment {

    private RecyclerView savingsRecyclerView;
    private SavingAdapter savingAdapter;
    private TextView totalSavingsTextView;
    private Button addSaveButton;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.saving, container, false);

        savingsRecyclerView = view.findViewById(R.id.savingRecyclerView);
        savingsRecyclerView.setLayoutManager(new LinearLayoutManager(getContext()));

        totalSavingsTextView = view.findViewById(R.id.cashvalue);
        addSaveButton = view.findViewById(R.id.addsave);


        addSaveButton.setOnClickListener(v -> {
            Intent intent = new Intent(getActivity(), amounts.class);
            startActivity(intent);
        });

        SharedPreferences sharedPreferences = getActivity().getSharedPreferences("MyAppPrefs", Context.MODE_PRIVATE);
        int userId = sharedPreferences.getInt("userId", -1);

        if (userId != -1) {
            new FetchSavingsTask().execute(userId);
        }

        return view;
    }

    private class FetchSavingsTask extends AsyncTask<Integer, Void, List<Saving>> {

        @Override
        protected List<Saving> doInBackground(Integer... params) {
            int userId = params[0];
            List<Saving> savings = new ArrayList<>();

            Connection connection = DatabaseConnection.getConnection();
            if (connection != null) {
                try {
                    String query = "SELECT date, amount FROM saving WHERE user_id = ?";
                    PreparedStatement statement = connection.prepareStatement(query);
                    statement.setInt(1, userId);

                    ResultSet resultSet = statement.executeQuery();
                    while (resultSet.next()) {
                        String date = resultSet.getString("date");
                        String amount = resultSet.getString("amount");

                        savings.add(new Saving(date, amount));
                    }

                    resultSet.close();
                    statement.close();
                    connection.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
            return savings;
        }

        @Override
        protected void onPostExecute(List<Saving> savings) {
            if (savings != null && !savings.isEmpty()) {
                savingAdapter = new SavingAdapter(savings);
                savingsRecyclerView.setAdapter(savingAdapter);
                updateTotalSavings(savings);
            }
        }
    }

    private void updateTotalSavings(List<Saving> savings) {
        double totalSavings = 0;
        for (Saving saving : savings) {
            totalSavings += Double.parseDouble(saving.getAmount());
        }
        totalSavingsTextView.setText(totalSavings + " $");
    }

    public static class Saving {
        private final String date, amount;

        public Saving(String date, String amount) {
            this.date = date;
            this.amount = amount;
        }

        public String getDate() {
            return date;
        }

        public String getAmount() {
            return amount;
        }
    }

    public static class SavingAdapter extends RecyclerView.Adapter<SavingAdapter.SavingViewHolder> {
        private final List<Saving> savings;

        public SavingAdapter(List<Saving> savings) {
            this.savings = savings;
        }

        @NonNull
        @Override
        public SavingViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.anamount, parent, false);
            return new SavingViewHolder(view);
        }

        @Override
        public void onBindViewHolder(@NonNull SavingViewHolder holder, int position) {
            Saving saving = savings.get(position);
            holder.dateTextView.setText(saving.getDate());
            holder.amountTextView.setText(saving.getAmount() + " $");
        }

        @Override
        public int getItemCount() {
            return savings.size();
        }

        static class SavingViewHolder extends RecyclerView.ViewHolder {
            TextView dateTextView, amountTextView;

            SavingViewHolder(@NonNull View itemView) {
                super(itemView);
                dateTextView = itemView.findViewById(R.id.dateam);
                amountTextView = itemView.findViewById(R.id.saveam);
            }
        }
    }
}
