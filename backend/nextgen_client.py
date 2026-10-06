import httpx
import asyncio
import logging

logger = logging.getLogger(__name__)

class NextgenClient:
    """
    Client for interacting with NextGen IEDB Tools natively via HTTPX.
    Bypasses Playwright completely for 10x faster execution and no browser overhead.
    """
    
    @staticmethod
    async def run_tool(tool_group: str, input_parameters: dict, **stage_kwargs):
        stage = {
            "stage_display_name": tool_group, "stage_number": 1, "stage_type": "prediction", "tool_group": tool_group,
            "input_parameters": input_parameters,
            "table_state": []
        }
        stage.update(stage_kwargs)
        payload = {
            "pipeline_id": "", "pipeline_title": "", "email": "", "run_stage_range": [1, 1],
            "stages": [stage]
        }
        return await NextgenClient._poll_nextgen_api(payload)

    @staticmethod
    async def _poll_nextgen_api(payload: dict, timeout: int = 900) -> list:
        async with httpx.AsyncClient(timeout=30.0) as client:
            res = await client.post("https://api-nextgen-tools.iedb.org/api/v1/pipeline", json=payload)
            if res.status_code != 200:
                raise Exception(f"Failed to start pipeline. Status: {res.status_code}, Response: {res.text}")
            
            res_data = res.json()
            if "errors" in res_data and res_data["errors"]:
                raise Exception(f"Pipeline errors: {res_data['errors']}")
                
            results_uri = res_data.get("results_uri")
            if not results_uri:
                raise Exception("No results_uri returned from NextGen API.")
            
            elapsed = 0
            while elapsed < timeout:
                poll_res = await client.get(results_uri)
                poll_data = poll_res.json()
                status = poll_data.get("status")
                
                if status == "done" or status == "COMPLETED":
                    tables = poll_data.get("data", {}).get("results", [])
                    if not tables:
                        return []
                    
                    # A PRIMEIRA tabela sempre contém os resultados da predição principal
                    main_table = tables[0]
                    if "table_columns" not in main_table or "table_data" not in main_table:
                        return []
                        
                    columns = [c["name"] for c in main_table["table_columns"]]
                    all_rows = [dict(zip(columns, row_vals)) for row_vals in main_table["table_data"]]
                    return all_rows
                
                elif status == "error" or status == "FAILED":
                    raise Exception(f"Pipeline failed: {poll_data.get('errors')}")
                
                await asyncio.sleep(1)
                elapsed += 1
                
            raise Exception("Timeout waiting for NextGen API.")
