import asyncio
from mcp.client.stdio import stdio_client
from mcp.client.session import ClientSession
from mcp.client.stdio import StdioServerParameters

async def main():
    server_params = StdioServerParameters(
        command="python",
        args=["-m", "awslabs.healthimaging_mcp_server.server"],
        env={"AWS_REGION": "us-east-1"}
    )
    try:
        async with stdio_client(server_params) as (read, write):
            async with ClientSession(read, write) as session:
                await session.initialize()
                
                print("--- MCP Tools ---")
                tools = await session.list_tools()
                for tool in tools.tools:
                    print(f"- {tool.name}: {tool.description}")
                
                print("\n--- MCP Resources ---")
                try:
                    resources = await session.list_resources()
                    for res in resources.resources:
                        print(f"- {res.name}: {res.uri}")
                except Exception as e:
                    print("Resources not supported or error:", e)
    except Exception as e:
        print("Failed to connect or query MCP server:", e)

if __name__ == "__main__":
    asyncio.run(main())
