import pandas as pd
import plotly.express as px
import plotly.graph_objects as go

import dash
import dash_core_components as dcc
import dash_html_components as html
from dash.dependencies import Input, Output

app = dash.Dash(__name__)

df = pd.read_csv("HackGTdata.csv")

rslt_df_A = df.loc[df['Medicine'] == 'A']
rslt_df_B = df.loc[df['Medicine'] == 'B']

rslt_df_A.reset_index(inplace=True)

rslt_df_B.reset_index(inplace=True)

app.layout = html.Div([

    html.H1("Data Visualization", style={'text-align': 'center'}),

    dcc.Dropdown(id="slct_medicine",
                 options=[
                     {"label": "Medicine A", "value": 'A'},
                     {"label": "Medicine B", "value": 'B'}],
                 multi=False,
                 value='A',
                 style={'width': "40%"}

                 ),

    dcc.Dropdown(id="slct_temp",
                 options=[
                     {"label": "Temperature A", "value": 'Temperature_A'},
                     {"label": "Temperature B", "value": 'Temperature_B'},
                     {"label": "Temperature C", "value": 'Temperature_C'},
                     {"label": "Temperature D", "value": 'Temperature_D'}],
                 multi=False,
                 value='Temperature_A',
                 style={'width': "40%"}

                 ),
    dcc.Dropdown(id="slct_humidity",
                 options=[
                     {"label": "Humidity A", "value": 'Humidity_A'},
                     {"label": "Humidity B", "value": 'Humidity_B'},
                     {"label": "Humidity C", "value": 'Humidity_C'},
                     {"label": "Humidity D", "value": 'Humidity_D'}],
                 multi=False,
                 value='Humidity_A',
                 style={'width': "40%"}

                 ),

    html.Div(id='output_container', children=[]),
    html.Br(),

    dcc.Graph(id='data_map', figure={}),
    dcc.Graph(id='box_map', figure={}),
    dcc.Graph(id='box2_map', figure={})
])


@app.callback(
    [Output(component_id='output_container', component_property='children'),
     Output(component_id='data_map', component_property='figure'),
     Output(component_id='box_map', component_property='figure'),
     Output(component_id='box2_map', component_property='figure')],
    [Input(component_id='slct_medicine', component_property='value'),
     Input(component_id='slct_temp', component_property='value'),
     Input(component_id='slct_humidity', component_property='value')]
)
def update_graph(option_medicine, option_temp, option_humidity):

    container = "The Medicine chosen is {}".format(option_medicine) \
                + (" and the temperature chosen is {} ".format(option_temp)) \
                + (" and the humidity chosen is {} ".format(option_humidity))

    if option_medicine == 'A':
        dff = rslt_df_A.copy()
    if option_medicine == 'B':
        dff = rslt_df_B.copy()

    fig = px.scatter(dff, x=option_temp, y=option_humidity, hover_data=['Item_Number'])

    fig2 = px.box(dff, x=option_temp, points="all", hover_data=['Item_Number'])

    fig3 = px.box(dff, x=option_humidity, points="all", hover_data=['Item_Number'])

    return container, fig, fig2, fig3


if __name__ == '__main__':
    app.run_server(debug=True)
