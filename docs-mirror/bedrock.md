---
source: https://docs.molt.bot/bedrock
title: Bedrock - Moltbot
---

[Skip to main content](https://docs.molt.bot/bedrock#content-area)

[Moltbot home page![light logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)![dark logo](https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26)](https://docs.molt.bot/)

Search...

Ctrl K

Search...

Navigation

On this page

- [Amazon Bedrock](https://docs.molt.bot/bedrock#amazon-bedrock)
- [What pi‑ai supports](https://docs.molt.bot/bedrock#what-pi%E2%80%91ai-supports)
- [Automatic model discovery](https://docs.molt.bot/bedrock#automatic-model-discovery)
- [Setup (manual)](https://docs.molt.bot/bedrock#setup-manual)
- [EC2 Instance Roles](https://docs.molt.bot/bedrock#ec2-instance-roles)
- [Notes](https://docs.molt.bot/bedrock#notes)

# [​](https://docs.molt.bot/bedrock\#amazon-bedrock)  Amazon Bedrock

Moltbot can use **Amazon Bedrock** models via pi‑ai’s **Bedrock Converse**
streaming provider. Bedrock auth uses the **AWS SDK default credential chain**,
not an API key.

## [​](https://docs.molt.bot/bedrock\#what-pi%E2%80%91ai-supports)  What pi‑ai supports

- Provider: `amazon-bedrock`
- API: `bedrock-converse-stream`
- Auth: AWS credentials (env vars, shared config, or instance role)
- Region: `AWS_REGION` or `AWS_DEFAULT_REGION` (default: `us-east-1`)

## [​](https://docs.molt.bot/bedrock\#automatic-model-discovery)  Automatic model discovery

If AWS credentials are detected, Moltbot can automatically discover Bedrock
models that support **streaming** and **text output**. Discovery uses
`bedrock:ListFoundationModels` and is cached (default: 1 hour).Config options live under `models.bedrockDiscovery`:

Copy

```
{
  models: {
    bedrockDiscovery: {
      enabled: true,
      region: "us-east-1",
      providerFilter: ["anthropic", "amazon"],
      refreshInterval: 3600,
      defaultContextWindow: 32000,
      defaultMaxTokens: 4096
    }
  }
}
```

Notes:

- `enabled` defaults to `true` when AWS credentials are present.
- `region` defaults to `AWS_REGION` or `AWS_DEFAULT_REGION`, then `us-east-1`.
- `providerFilter` matches Bedrock provider names (for example `anthropic`).
- `refreshInterval` is seconds; set to `0` to disable caching.
- `defaultContextWindow` (default: `32000`) and `defaultMaxTokens` (default: `4096`)
are used for discovered models (override if you know your model limits).

## [​](https://docs.molt.bot/bedrock\#setup-manual)  Setup (manual)

1. Ensure AWS credentials are available on the **gateway host**:

Copy

```
export AWS_ACCESS_KEY_ID="AKIA..."
export AWS_SECRET_ACCESS_KEY="..."
export AWS_REGION="us-east-1"
# Optional:
export AWS_SESSION_TOKEN="..."
export AWS_PROFILE="your-profile"
# Optional (Bedrock API key/bearer token):
export AWS_BEARER_TOKEN_BEDROCK="..."
```

2. Add a Bedrock provider and model to your config (no `apiKey` required):

Copy

```
{
  models: {
    providers: {
      "amazon-bedrock": {
        baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
        api: "bedrock-converse-stream",
        auth: "aws-sdk",
        models: [\
          {\
            id: "anthropic.claude-opus-4-5-20251101-v1:0",\
            name: "Claude Opus 4.5 (Bedrock)",\
            reasoning: true,\
            input: ["text", "image"],\
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },\
            contextWindow: 200000,\
            maxTokens: 8192\
          }\
        ]
      }
    }
  },
  agents: {
    defaults: {
      model: { primary: "amazon-bedrock/anthropic.claude-opus-4-5-20251101-v1:0" }
    }
  }
}
```

## [​](https://docs.molt.bot/bedrock\#ec2-instance-roles)  EC2 Instance Roles

When running Moltbot on an EC2 instance with an IAM role attached, the AWS SDK
will automatically use the instance metadata service (IMDS) for authentication.
However, Moltbot’s credential detection currently only checks for environment
variables, not IMDS credentials.**Workaround:** Set `AWS_PROFILE=default` to signal that AWS credentials are
available. The actual authentication still uses the instance role via IMDS.

Copy

```
# Add to ~/.bashrc or your shell profile
export AWS_PROFILE=default
export AWS_REGION=us-east-1
```

**Required IAM permissions** for the EC2 instance role:

- `bedrock:InvokeModel`
- `bedrock:InvokeModelWithResponseStream`
- `bedrock:ListFoundationModels` (for automatic discovery)

Or attach the managed policy `AmazonBedrockFullAccess`.**Quick setup:**

Copy

```
# 1. Create IAM role and instance profile
aws iam create-role --role-name EC2-Bedrock-Access \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [{\
      "Effect": "Allow",\
      "Principal": {"Service": "ec2.amazonaws.com"},\
      "Action": "sts:AssumeRole"\
    }]
  }'

aws iam attach-role-policy --role-name EC2-Bedrock-Access \
  --policy-arn arn:aws:iam::aws:policy/AmazonBedrockFullAccess

aws iam create-instance-profile --instance-profile-name EC2-Bedrock-Access
aws iam add-role-to-instance-profile \
  --instance-profile-name EC2-Bedrock-Access \
  --role-name EC2-Bedrock-Access

# 2. Attach to your EC2 instance
aws ec2 associate-iam-instance-profile \
  --instance-id i-xxxxx \
  --iam-instance-profile Name=EC2-Bedrock-Access

# 3. On the EC2 instance, enable discovery
moltbot config set models.bedrockDiscovery.enabled true
moltbot config set models.bedrockDiscovery.region us-east-1

# 4. Set the workaround env vars
echo 'export AWS_PROFILE=default' >> ~/.bashrc
echo 'export AWS_REGION=us-east-1' >> ~/.bashrc
source ~/.bashrc

# 5. Verify models are discovered
moltbot models list
```

## [​](https://docs.molt.bot/bedrock\#notes)  Notes

- Bedrock requires **model access** enabled in your AWS account/region.
- Automatic discovery needs the `bedrock:ListFoundationModels` permission.
- If you use profiles, set `AWS_PROFILE` on the gateway host.
- Moltbot surfaces the credential source in this order: `AWS_BEARER_TOKEN_BEDROCK`,
then `AWS_ACCESS_KEY_ID` \+ `AWS_SECRET_ACCESS_KEY`, then `AWS_PROFILE`, then the
default AWS SDK chain.
- Reasoning support depends on the model; check the Bedrock model card for
current capabilities.
- If you prefer a managed key flow, you can also place an OpenAI‑compatible
proxy in front of Bedrock and configure it as an OpenAI provider instead.

[Anthropic](https://docs.molt.bot/providers/anthropic) [Moonshot](https://docs.molt.bot/providers/moonshot)

Ctrl+I

Assistant

Responses are generated using AI and may contain mistakes.