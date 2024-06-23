-- This is an empty migration.

CREATE OR REPLACE FUNCTION get_user_balance(uid UUID)
RETURNS TABLE (
    incomes INTEGER,
    expenses INTEGER,
    investments INTEGER,
    balance INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
      SUM(CASE WHEN type = 'INVESTMENT' THEN amount ELSE 0 END) AS investments,
      SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END) AS incomes,
      SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) AS expenses,
      (
        SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END)
        - SUM(CASE WHEN type = 'INVESTMENT' THEN amount ELSE 0 END)
        - SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END)
      ) AS balance
    
    FROM 
      transactions
    WHERE
        user_id = get_user_balance.uid;
END; $$
  LANGUAGE plpgsql;