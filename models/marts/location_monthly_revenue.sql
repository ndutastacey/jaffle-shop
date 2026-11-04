with

orders as (

    select * from {{ ref('orders') }}

),

locations as (

    select * from {{ ref('locations') }}

),

monthly as (

    select
        location_id,
        date_trunc(cast(ordered_at as date), month) as revenue_month,
        count(order_id) as order_count,
        sum(order_total) as revenue,
        sum(order_cost) as supply_cost

    from orders
    group by location_id, revenue_month

)

select
    monthly.location_id,
    locations.location_name,
    monthly.revenue_month,
    monthly.order_count,
    monthly.revenue,
    monthly.supply_cost,
    monthly.revenue - monthly.supply_cost as gross_profit,
    round(safe_divide(monthly.revenue, monthly.order_count), 2) as avg_order_value,
    current_timestamp() as built_at

from monthly
left join locations
    on monthly.location_id = locations.location_id