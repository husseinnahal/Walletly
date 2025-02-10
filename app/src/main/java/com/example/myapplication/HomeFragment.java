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
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.myapplication.database.DatabaseConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class HomeFragment extends Fragment {

    private RecyclerView paymentsRecyclerView;
    private PaymentAdapter paymentAdapter;
    private TextView incomeTextView, expensesTextView, cashText;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_home, container, false);

        paymentsRecyclerView = view.findViewById(R.id.payRecyclerView);
        paymentsRecyclerView.setLayoutManager(new LinearLayoutManager(getContext()));

        incomeTextView = view.findViewById(R.id.income);
        expensesTextView = view.findViewById(R.id.expenses);
        cashText = view.findViewById(R.id.cashvalue);

        Button btnAddTransaction = view.findViewById(R.id.addTran);
        btnAddTransaction.setOnClickListener(v -> startActivity(new Intent(getActivity(), Addtransactation.class)));

        SharedPreferences sharedPreferences = getActivity().getSharedPreferences("MyAppPrefs", Context.MODE_PRIVATE);
        int userId = sharedPreferences.getInt("userId", -1);

        if (userId != -1) {
            new FetchPaymentsTask().execute(userId);
        }

        return view;
    }

    private class FetchPaymentsTask extends AsyncTask<Integer, Void, List<Payment>> {

        @Override
        protected List<Payment> doInBackground(Integer... params) {
            int userId = params[0];
            List<Payment> payments = new ArrayList<>();

            Connection connection = DatabaseConnection.getConnection();
            if (connection != null) {
                try {
                    String query = "SELECT title, category, amount, type FROM payments WHERE user_id = ?";
                    PreparedStatement statement = connection.prepareStatement(query);
                    statement.setInt(1, userId);

                    ResultSet resultSet = statement.executeQuery();
                    while (resultSet.next()) {
                        String name = resultSet.getString("title");
                        String category = resultSet.getString("category");
                        String amount = resultSet.getString("amount");
                        String type = resultSet.getString("type");

                        payments.add(new Payment(name, category, amount, type));
                    }

                    resultSet.close();
                    statement.close();
                    connection.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }

            return payments;
        }

        @Override
        protected void onPostExecute(List<Payment> payments) {
            if (payments != null && !payments.isEmpty()) {

                paymentAdapter = new PaymentAdapter(payments);
                paymentsRecyclerView.setAdapter(paymentAdapter);

                updateIncomeTotal(payments);
            }
        }
    }

    private void updateIncomeTotal(List<Payment> payments) {
        double totalIncome = 0;
        double totalExpenses = 0;

        for (Payment payment : payments) {
            if (payment.getType().equalsIgnoreCase("income")) {
                totalIncome += Double.parseDouble(payment.getAmount());
            } else {
                totalExpenses += Double.parseDouble(payment.getAmount());
            }
        }

        incomeTextView.setText(totalIncome + " $");
        expensesTextView.setText(totalExpenses + " $");
        cashText.setText((totalIncome - totalExpenses) + " $");
    }

    public static class Payment {
        private final String name, category, amount, type;

        public Payment(String name, String category, String amount, String type) {
            this.name = name;
            this.category = category;
            this.amount = amount;
            this.type = type;
        }

        public String getName() { return name; }
        public String getCategory() { return category; }
        public String getAmount() { return amount; }
        public String getType() { return type; }
    }

    public static class PaymentAdapter extends RecyclerView.Adapter<PaymentAdapter.PaymentViewHolder> {

        private final List<Payment> payments;

        public PaymentAdapter(List<Payment> payments) {
            this.payments = payments;
        }

        @NonNull
        @Override
        public PaymentViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.apayment, parent, false);
            return new PaymentViewHolder(view);
        }

        @Override
        public void onBindViewHolder(@NonNull PaymentViewHolder holder, int position) {
            Payment payment = payments.get(position);
            holder.nameTextView.setText(payment.getName());
            holder.categoryTextView.setText(payment.getCategory());
            holder.amountTextView.setText(payment.getAmount() + " $");

            // Change color
            int color = payment.getType().equalsIgnoreCase("income")
                    ? android.R.color.holo_green_dark
                    : android.R.color.holo_red_dark;

            holder.amountTextView.setTextColor(holder.itemView.getContext().getResources().getColor(color));
        }

        @Override
        public int getItemCount() {
            return payments.size();
        }

        static class PaymentViewHolder extends RecyclerView.ViewHolder {
            TextView nameTextView, categoryTextView, amountTextView;

            PaymentViewHolder(@NonNull View itemView) {
                super(itemView);
                nameTextView = itemView.findViewById(R.id.dateam);
                categoryTextView = itemView.findViewById(R.id.cattext);
                amountTextView = itemView.findViewById(R.id.saveam);
            }
        }
    }
}
