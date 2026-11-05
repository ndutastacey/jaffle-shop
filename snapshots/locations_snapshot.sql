{% snapshot location_monthly_revenue_snapshot %}

{{
    config(
        target_schema='snapshots',
        unique_key="concat(cast(location_id as string), '-', cast(revenue_month as string))",
        strategy='check',
        check_cols=[
            'location_name',
            'revenue',
            'order_count',
            'gross_profit',
            'avg_order_value'
        ]
    )
}}

SELECT
    location_id,
    location_name,
    revenue_month,
    revenue,
    order_count,
    gross_profit,
    avg_order_value
FROM {{ ref('location_monthly_revenue') }}

{% endsnapshot %}